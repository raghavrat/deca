# DECA Pal

DECA Pal is an independent study application with an original first-party business question bank and AI-assisted roleplay practice for DECA competitors. It is not affiliated with, endorsed by, or an official product of DECA Inc.

## Local development

1. Copy `.env.example` to `.env.local` and supply your own Firebase and OpenRouter configuration.
2. Run `npm ci`.
3. Run `npm run dev`.

Before a production deployment, run:

```sh
npm run typecheck
npm test -- --runInBand
npm run lint
npm run build
npm audit --omit=dev
```

Deploy `firestore.rules` with the Firebase project used by the application. The code assumes those rules are active; merely committing them does not protect an existing database.

## Privacy, security, and accessibility

- The application includes privacy, terms, and accessibility pages, account export/deletion, opt-in leaderboard visibility, verified server sessions, restricted roleplay APIs, and AI-provider privacy routing.
- The target is WCAG 2.2 Level AA. This is not a certification; complete manual keyboard, screen-reader, zoom/reflow, and contrast checks against the deployed site.
- Legal applicability depends on the operator, users, schools, jurisdictions, contracts, and actual deployment. Do not market the repository as ADA, COPPA, FERPA, GDPR, CCPA/CPRA, SOC 2, or other legally compliant without appropriate professional review and operational evidence.

See [the internal audit](docs/internal-audit-2026-07-20.md), [the AI-test copyright review](docs/ai-test-copyright-safety.md), [the roleplay prompt research](docs/roleplay-prompt-research.md), [the security policy](SECURITY.md), and [the content provenance checklist](docs/content-provenance.md).

For the staged Clerk Auth and Billing cutover, use the [Clerk migration runbook](docs/clerk-auth-billing-migration.md). Firebase remains the default provider until both migration switches are explicitly changed.
