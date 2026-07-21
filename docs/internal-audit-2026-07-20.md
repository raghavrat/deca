# Internal Security, Privacy, and Accessibility Audit

Date: 2026-07-20
Scope: repository source, current dependency tree, Git history secret-pattern scan, authentication/data flows, AI roleplay flow, public policy claims, and static accessibility review.

## Executive result

The audit found critical authorization and privacy defects in the original application. The repository now includes code-level mitigations, but it is **not a legal certification or an accessibility conformance report**. Production configuration, manual testing, contracts, incident processes, and jurisdiction-specific legal review remain required.

## Remediated findings

| Severity | Original risk | Remediation in this worktree |
| --- | --- | --- |
| Critical | Roleplay history and individual records trusted a browser-supplied email, permitting cross-account access | All roleplay routes derive UID/email from a verified, revocation-checked server session |
| Critical | AI generation and processing lacked effective server authorization | Same-origin checks and verified session enforcement added |
| Critical | Vulnerable framework/dependency versions, including high/critical advisories | Next.js, React, Firebase, and tooling upgraded; high/critical audit findings removed at audit time |
| High | Session cookies/tokens and user identifiers were logged | Credential and personal-data logging removed or minimized; generic errors returned |
| High | Audio/transcripts were sent to AI services without an explicit user disclosure or restrictive provider routing | Pre-submit disclosure/consent added; OpenRouter requests deny provider data collection and require zero-data-retention routing |
| High | The static practice bank contained 310 questions traceable to published DECA/MBA Research exams | Copied bank removed; a fixed 7,000-question first-party bank now covers all seven written-exam families using original concept blueprints, quota and originality checks, legacy-stem fingerprints, provenance labels, and signed answer verification |
| High | Unbounded AI payloads/responses created cost, denial-of-service, and stored-data risks | Request/audio/transcript limits, schema checks, score clamping, response length checks, and per-account limits added |
| High | Firestore clients could read broad leaderboard data and directly access roleplay collections | Owner-scoped rules added; roleplays are server-only; leaderboard is authenticated, minimized, and opt-in |
| High | Account data had no user export/deletion path | Authenticated export and deletion endpoint plus account controls added |
| Medium | Public documents asserted unsupported certifications, outcomes, uptime, and scale | Claims corrected or expressly labeled as unverified targets |
| Medium | Workflow actions used a mutable tag | Third-party workflow actions pinned to immutable commit SHAs |
| Medium | Core keyboard/screen-reader behavior was incomplete | Skip link, landmarks, labels, status semantics, focus visibility, menu/dropdown states, motion preference, carousel pause, and non-color quiz feedback added |

## Privacy controls implemented

- A data-specific privacy notice and Terms page linked site-wide.
- Account export and permanent deletion.
- Leaderboard participation off by default and limited to name/count for opted-in users.
- Signup requires a 13-or-older attestation and policy acceptance.
- Raw roleplay audio is processed but not intentionally stored by DECA Pal; transcript, score, and feedback storage is disclosed.
- User document access is owner-only; AI roleplay records are accessible only through authenticated server APIs.
- Hard-coded personal email addresses were removed from current source.

## Accessibility work completed

The application now has a WCAG 2.2 Level AA target, a skip link and main landmark, visible keyboard focus, reduced-motion handling, labeled forms/controls, exposed validation status, semantic navigation state, pauseable carousel movement, and result cues that do not rely only on color.

This does not establish full conformance. Test the deployed application at 200% and 400% zoom, with keyboard only, forced colors/high contrast, reduced motion, VoiceOver/Safari, NVDA/Firefox or Chrome, and automated tooling. Record defects and retest fixes. Include all authentication, quiz, roleplay, review, history, account, privacy, and error flows.

## Required before production launch

1. Replace placeholder operator/contact details and actively monitor `privacy@decapal.org` and `security@decapal.org`.
2. Deploy and test `firestore.rules` against the correct Firebase project; confirm App Check, authorized domains, least-privilege service accounts, budgets, alerts, and access logs.
3. Verify the host's security headers and CSP against Firebase authentication and every production flow.
4. Confirm OpenRouter/provider privacy settings, contracts, retention, regional processing, and model-provider changes in the live account—not only request JSON.
5. Decide the actual age/school model. If the service is directed to children under 13 or the operator has actual knowledge of under-13 use, implement the required parental notice/consent process or block that use. A checkbox alone is not a universal COPPA solution.
6. If schools use the service, execute appropriate school/vendor terms and data-processing agreements and document FERPA/state student-privacy responsibilities, deletion, access, security, and subcontractors.
7. Determine which state, federal, and international privacy laws apply based on operator identity, location, thresholds, users, and deployment. Configure an intake/verification process for rights requests and statutory response deadlines.
8. Complete the remaining content/trademark provenance review in `docs/content-provenance.md`; the copied static question bank has been removed, but performance-indicator and rubric sources still require resolution.
9. Obtain a manual accessibility audit and a remediation/retest record before claiming WCAG conformance or ADA compliance.
10. Add production monitoring, a distributed rate limiter/WAF, backups with a restore test, incident response owners, breach-notification analysis, retention automation, and periodic access review.
11. Run an independent penetration test before a broad or paid launch and after material authentication/data-flow changes.
12. Because registration and public practice are open, enforce production WAF/rate limits, Firebase abuse protections, spend alerts, and capacity monitoring before broad promotion.

## Verification commands

```sh
npm run typecheck
npm test -- --runInBand
npm run lint
npm run build
npm audit --omit=dev
git diff --check
```

The results reported at handoff apply only to this worktree and date. Re-run them after configuration or dependency changes.
