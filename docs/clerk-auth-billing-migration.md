# Clerk authentication and billing migration

This repository supports a reversible authentication cutover from Firebase Authentication to Clerk while retaining Firestore as the application database. Firebase remains the default until both provider switches are changed to `clerk`.

## What is implemented

- Clerk's prebuilt sign-in, sign-up, reset, pricing, and subscription flows.
- Server-side identity checks for both Firebase and Clerk.
- Firestore compatibility through Clerk `external_id`: imported users keep their Firebase UID as their Firestore document key, while new users use their Clerk ID.
- Server-side profile reads and writes. Firestore browser access is denied.
- B2C plan enforcement on roleplay generation:
  - Starter: 2 lifetime generations.
  - Champion: 100 generations per calendar month.
  - Elite: unlimited generations, subject to abuse and upstream service limits.
- Transactional usage reservations so failed AI requests do not consume a plan allowance.
- Provider-aware account export and deletion, including nested usage records, roleplay history, Clerk identity, and any linked legacy Firebase identity.
- Clerk-generated Content Security Policy headers when Clerk is active.

The implementation follows Clerk's current guidance for [`clerkMiddleware`](https://clerk.com/docs/reference/nextjs/clerk-middleware), [automatic CSP configuration](https://clerk.com/docs/guides/secure/best-practices/csp-headers), [user migration](https://clerk.com/docs/guides/development/migrating/overview), and [B2C Billing](https://clerk.com/docs/nextjs/guides/billing/for-b2c).

## Dashboard configuration

Create and validate a Clerk development instance first. Development and production instances are separate; users cannot be promoted from development to production.

1. Enable email/password sign-in and email verification.
2. Enable **Require express consent to legal documents** and configure links to `/terms` and `/privacy`.
3. Disable Clerk's direct self-service account deletion. Deletion must use Deca Pal's Account page so Firestore data and any linked Firebase identity are removed with the Clerk identity.
4. Enable B2C Billing with the Clerk development payment gateway.
5. Create plans whose exact slugs are:
   - `champion`
   - `elite`
6. Set prices and trial terms in the dashboard. The application intentionally does not invent prices.
7. Test successful checkout, failed cards, upgrades, downgrades, cancellation, trial expiration, and account deletion with development test cards.

For production, connect a production Stripe account to the Clerk production instance. Do not create matching Stripe Billing products: Clerk plans and subscriptions are managed in Clerk and are not synchronized into Stripe Billing.

The optional Elite Lifetime purchase is the only direct Stripe Checkout product. It uses a one-time Stripe Price, a signed webhook, and a Firestore entitlement. Configure the webhook for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and `charge.dispute.created`. Refunds and disputes revoke lifetime access.

## Required environment variables

Keep the migration off:

```dotenv
AUTH_PROVIDER=firebase
NEXT_PUBLIC_AUTH_PROVIDER=firebase
```

Configure Clerk without switching providers:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/performance
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/performance
CLERK_CHAMPION_PLAN_SLUG=champion
CLERK_ELITE_PLAN_SLUG=elite
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_LIFETIME_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_LIFETIME_ENABLED=false
NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_USD=149.99
```

Keep `NEXT_PUBLIC_STRIPE_LIFETIME_ENABLED=false` until the live Stripe account is activated, the live Price and webhook are configured, and a production Checkout smoke test succeeds. Set it to `true` in the deployment that makes the lifetime option public.

Only after preview verification and the production user import, change both provider switches to `clerk` in the same deployment.

## Existing-user migration

Clerk recommends a coordinated export/import or a deliberately designed trickle migration. This application uses a coordinated import because existing Firestore ownership is keyed to Firebase UID.

1. Export Firebase Authentication users to a secure path outside the repository:

   ```sh
   firebase auth:export /secure/firebase-users.json --format=json --project YOUR_PROJECT_ID
   ```

2. Export the matching `users` Firestore documents to a secure JSON object keyed by Firebase UID. Each entry must include `age13Confirmed`, `termsAcceptedAt`, `privacyPolicyVersion`, and `displayName`. Do not place either export in source control.
3. Obtain the Firebase scrypt signer key, salt separator, rounds, and memory cost from the Firebase export/configuration output.
4. Run the included validator without `--execute`:

   ```sh
   FIREBASE_SCRYPT_SIGNER_KEY=... \
   FIREBASE_SCRYPT_SALT_SEPARATOR=... \
   FIREBASE_SCRYPT_ROUNDS=... \
   FIREBASE_SCRYPT_MEM_COST=... \
   npm run migrate:clerk-users -- \
     --users /secure/firebase-users.json \
     --profiles /secure/profile-consents.json
   ```

5. Review the validated and skipped counts. The script refuses users without recorded age/policy consent and skips unverified accounts or accounts without password hashes.
6. Back up Firebase Auth and Firestore. Set `CLERK_SECRET_KEY` to the **production** Clerk secret and run the import only during the scheduled cutover:

   ```sh
   CLERK_MIGRATION_CONFIRM=IMPORT_TO_CLERK \
   npm run migrate:clerk-users -- \
     --users /secure/firebase-users.json \
     --profiles /secure/profile-consents.json \
     --execute
   ```

The importer sets the Firebase UID as Clerk `external_id`, imports the Firebase scrypt password digest, carries forward legal acceptance, and is restart-safe for users already present by external ID. Clerk's Backend API automatically verifies email addresses created through user import. Test a representative imported account against its existing tests, progress, roleplay history, export, and deletion before enabling the provider switch.

## Cutover and rollback

Before cutover:

- Put account creation into a short maintenance window so the export is not stale.
- Complete the production import and reconcile imported, skipped, and failed counts.
- Run `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, and `npm audit --omit=dev` with Clerk production-like variables in a preview environment.
- Confirm the Privacy Policy, Terms, operator identity, refund policy, support route, and plan prices with qualified legal and tax advisers.
- Deploy Firestore rules; committing the file alone does not change the live database.

Cut over by changing both provider switches to `clerk` in one deployment. Verify sign-in, sign-up consent, protected routes, all five test categories, all roleplay formats, billing checkout, account export, and deletion.

Rollback is safe only while no new Clerk-only accounts or billing changes have occurred. Change both provider switches back to `firebase` and redeploy. After accepting Clerk sign-ups or payments, reconcile those users and transactions before rollback; a flag change alone would strand Clerk-only accounts.

## Billing limitations that block an unreviewed global launch

Clerk Billing currently supports USD only, is not a merchant of record, does not calculate tax or VAT, cannot complete 3D Secure challenges, and does not support some countries. Refunds must be issued in Stripe and are not reflected in Clerk's revenue calculations. Review the current [Clerk Billing limitations](https://clerk.com/docs/guides/billing/overview) before every production launch and restrict availability where necessary.
