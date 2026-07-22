import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  grantLifetimeAccess,
  revokeLifetimeAccess,
} from '../../../utils/lifetimeEntitlements'
import { getStripeClient } from '../../../utils/stripe'

function metadataUserUid(metadata: Stripe.Metadata | null): string | null {
  const value = metadata?.user_uid
  return typeof value === 'string' && value.length > 0 && value.length <= 128 && !value.includes('/')
    ? value
    : null
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.metadata?.entitlement !== 'elite_lifetime' || session.payment_status !== 'paid') return
  const userUid = metadataUserUid(session.metadata)
  if (!userUid) throw new Error('Lifetime checkout is missing a valid user ID')

  await grantLifetimeAccess(userUid, {
    checkoutSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    amountTotal: session.amount_total,
    currency: session.currency,
  })
}

async function userUidForCharge(charge: Stripe.Charge): Promise<string | null> {
  if (typeof charge.payment_intent !== 'string') return null
  const paymentIntent = await getStripeClient().paymentIntents.retrieve(charge.payment_intent)
  return metadataUserUid(paymentIntent.metadata)
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripeClient().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    )
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await handleCompletedCheckout(event.data.object)
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object
      if (charge.refunded || charge.amount_refunded >= charge.amount) {
        const userUid = await userUidForCharge(charge)
        if (userUid) await revokeLifetimeAccess(userUid, 'refunded')
      }
    } else if (event.type === 'charge.dispute.created') {
      const dispute = event.data.object
      const charge = typeof dispute.charge === 'string'
        ? await getStripeClient().charges.retrieve(dispute.charge)
        : dispute.charge
      const userUid = charge ? await userUidForCharge(charge) : null
      if (userUid) await revokeLifetimeAccess(userUid, 'disputed')
    }

    return NextResponse.json({ received: true })
  } catch {
    console.error('Unable to process Stripe webhook event', event.type)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
