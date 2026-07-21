import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Use' }
const contactEmail = process.env.PRIVACY_CONTACT_EMAIL || 'privacy@decapal.org'
const copyrightEmail = process.env.COPYRIGHT_CONTACT_EMAIL || 'copyright@decapal.org'

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 text-neutral-800 dark:text-neutral-200">
      <header className="mb-12 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">Effective July 21, 2026</p>
        <h1 className="text-4xl font-light tracking-tight text-black dark:text-white">Terms of Use</h1>
      </header>
      <div className="legal-copy space-y-10">
        <section><h2>Eligibility and agreement</h2><p>You must be at least 13 to use Deca Pal. If you are under the age of legal majority, you represent that a parent or guardian has permitted your use. By creating an account or using the service, you agree to these Terms and the <Link href="/privacy">Privacy Policy</Link>.</p></section>
        <section><h2>Educational service only</h2><p>Deca Pal is an independent practice tool, not an official competition administrator, school, or professional adviser. Authored questions and AI-generated scenarios, transcripts, scores, and feedback may be inaccurate and should be reviewed critically. They are independent practice materials, not official DECA competition materials or results.</p></section>
        <section><h2>Acceptable use</h2><p>You may not misuse the service, access another person’s account, probe or bypass security controls, automate excessive requests, submit unlawful or harmful material, infringe intellectual-property or privacy rights, or use the service to make high-impact decisions about another person.</p></section>
        <section><h2>Your content</h2><p>You keep ownership of content you submit. You grant Deca Pal a limited permission to process it only as needed to operate, secure, and improve the requested features. Do not submit confidential information or another person’s personal information without authority.</p></section>
        <section><h2>Availability and accounts</h2><p>Features may change, be suspended, or be discontinued. We may restrict accounts that threaten users or the service. You may download your data and delete your account from the Account page.</p></section>
        <section><h2>Paid plans and renewals</h2><p>If paid plans are offered, the price, billing interval, included features, trial terms, and any applicable taxes will be shown before purchase. Subscriptions renew automatically until canceled. Upgrades may take effect immediately; downgrades and cancellations generally take effect at the end of the current billing period. You can manage an active subscription through the account or pricing interface. Except where required by law, charges are non-refundable; contact us if you believe a charge was made in error. Payment availability may be limited by country, currency, tax, or payment-authentication requirements.</p></section>
        <section><h2>Intellectual property and names</h2><p>The Deca Pal software, concept blueprints, and original site materials are protected by applicable law. “DECA” and related marks belong to their respective owners. Deca Pal is not affiliated with, sponsored by, or endorsed by DECA Inc. Do not submit, reproduce, adapt, or distribute official exams, scenarios, DECA+ content, or another publisher’s question bank through the service. If you believe material on Deca Pal infringes your rights, send the URL, identification of the work, your contact information, and a good-faith explanation to <a href={`mailto:${copyrightEmail}`}>{copyrightEmail}</a>.</p></section>
        <section><h2>Disclaimers and liability</h2><p>To the extent permitted by law, the service is provided “as is” without warranties of uninterrupted availability, accuracy, fitness for a particular purpose, or non-infringement. Nothing in these Terms excludes rights or liabilities that cannot legally be excluded. Because operator identity and jurisdiction-specific business details are not yet configured in this repository, these Terms should be reviewed by qualified counsel before a paid or public launch.</p></section>
        <section><h2>Contact and changes</h2><p>We may update these Terms by posting a revised date and providing additional notice when legally required. Contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with questions.</p></section>
      </div>
    </article>
  )
}
