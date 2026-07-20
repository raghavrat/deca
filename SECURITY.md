# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include credentials, account data, transcripts, or other personal information in an issue. Report it privately to `security@decapal.org` after that inbox has been configured and monitored. Until then, disable public security-reporting claims and use the repository owner's verified private contact channel.

Include the affected route or component, reproduction steps, impact, and any suggested mitigation. Do not access another person's account or data, degrade the service, or retain downloaded personal data while testing.

## Maintainer response process

1. Acknowledge a report without requesting unnecessary personal information.
2. Reproduce it in a non-production environment.
3. Contain exposed credentials or data, including key rotation and session revocation where needed.
4. Patch and test the issue, then assess notification duties with qualified counsel.
5. Record the incident, affected data, timeline, decisions, and prevention work in a restricted incident log.

Never place secrets in source control. Use the deployment provider's secret storage, least-privilege service accounts, dependency monitoring, and branch protection. Review access at least quarterly and after team changes.
