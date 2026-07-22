import { NextRequest, NextResponse } from 'next/server'
import { hasLifetimeAccess } from '../../../utils/lifetimeEntitlements'
import {
  RequestError,
  requestErrorResponse,
  requireSameOrigin,
  requireSession,
} from '../../../utils/serverAuth'
import { getStripeClient } from '../../../utils/stripe'

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    if (user.provider !== 'clerk') {
      throw new RequestError(503, 'Lifetime checkout is unavailable during authentication migration')
    }
    if (await hasLifetimeAccess(user.uid)) {
      throw new RequestError(409, 'Lifetime access is already active on this account')
    }

    const priceId = process.env.STRIPE_LIFETIME_PRICE_ID
    if (!priceId) throw new RequestError(503, 'Lifetime checkout is not configured')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
    const stripe = getStripeClient()
    const metadata = {
      entitlement: 'elite_lifetime',
      user_uid: user.uid,
      clerk_user_id: user.authUid,
    }
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: user.authUid,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/account?purchase=lifetime-success`,
      cancel_url: `${siteUrl}/pricing?purchase=canceled`,
      allow_promotion_codes: true,
      metadata,
      payment_intent_data: { metadata },
    })

    if (!checkout.url) throw new Error('Stripe did not return a Checkout URL')
    return NextResponse.json({ url: checkout.url }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    const response = requestErrorResponse(error)
    if (response) return response
    console.error('Unable to create lifetime checkout')
    return NextResponse.json({ error: 'Unable to start checkout' }, { status: 500 })
  }
}

