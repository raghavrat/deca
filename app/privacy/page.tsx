import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Deca Pal collects, uses, discloses, retains, and protects personal information.',
}

const contactEmail = process.env.PRIVACY_CONTACT_EMAIL || 'privacy@decapal.org'

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 text-neutral-800 dark:text-neutral-200">
      <header className="mb-12 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">Effective and last updated July 21, 2026</p>
        <h1 className="text-4xl font-light tracking-tight text-black dark:text-white">Privacy Policy</h1>
        <p className="mt-5 max-w-3xl leading-7">
          This policy explains how Deca Pal collects and handles information when you use the website and its practice tools. Deca Pal is an independent service and is not affiliated with DECA Inc.
        </p>
      </header>

      <div className="legal-copy space-y-10">
        <section>
          <h2>Information we collect</h2>
          <ul>
            <li><strong>Account information:</strong> email address, username, authentication-provider user ID, email-verification status, age and policy confirmations, and account creation time.</li>
            <li><strong>Learning information:</strong> problems-completed totals, optional leaderboard preference, roleplay scenarios, transcripts, AI feedback, scores, and timestamps.</li>
            <li><strong>Audio you choose to submit:</strong> roleplay audio is processed to create a transcript and feedback. Deca Pal does not save the audio file to its database.</li>
            <li><strong>Browser-only information:</strong> question practice statistics and theme preference are stored in local storage on your device.</li>
            <li><strong>Technical information:</strong> hosting, authentication, security, and AI providers may process IP address, user agent, request timing, and similar service metadata.</li>
          </ul>
        </section>

        <section>
          <h2>Why we use information</h2>
          <p>We use information to authenticate users, provide and secure the service, save progress, serve original practice questions, generate and grade practice roleplays, honor privacy choices, troubleshoot failures, prevent abuse, and comply with law. We do not use personal information for targeted advertising.</p>
        </section>

        <section>
          <h2>AI processing and service providers</h2>
          <p>
            When you expressly agree and submit a recording, its audio and the related practice scenario are sent through OpenRouter to an AI model provider for transcription and grading. Requests are configured to deny provider data collection and require a zero-data-retention endpoint. OpenRouter may retain request metadata such as model, token count, latency, and cost. Provider practices and legally required security or abuse processing may still apply.
          </p>
          <p>Practice-test questions are selected from a deterministic, first-party question bank built from authored anchors and scenario templates. Your selected test category and questions are not sent to OpenRouter or another AI model provider. Answer choices are shuffled on the server, and only the signed-in account identifier needed to issue and verify a short-lived answer token is processed.</p>
          <p>We use Google Firebase for database services and, depending on the deployed authentication configuration, Firebase Authentication or Clerk for account access. If you choose a paid plan, Clerk Billing and its payment processor, Stripe, process subscription and payment information. Deca Pal does not receive your full payment-card number. We use Vercel or a comparable hosting provider to deliver the website. These providers process information for us under their applicable service terms.</p>
        </section>

        <section>
          <h2>How we disclose information</h2>
          <p>We disclose information to service providers described above, when you direct us to do so, to protect users and the service, or when legally required. If you opt in to the leaderboard, your username and problems-completed total are visible to other signed-in users. The leaderboard is off by default.</p>
          <p><strong>Deca Pal does not sell personal information or share it for cross-context behavioral advertising.</strong> We do not knowingly sell or share the personal information of users under 16.</p>
        </section>

        <section>
          <h2>Cookies and local storage</h2>
          <p>We use strictly necessary authentication cookies or session tokens and local storage for theme and on-device practice statistics. Authentication-cookie duration depends on the active authentication provider and session settings. We do not currently use advertising cookies or third-party behavioral analytics. If that changes, this policy and any required consent controls must be updated before deployment.</p>
        </section>

        <section>
          <h2>Retention</h2>
          <p>Account profiles, learning totals, plan-usage counters, transcripts, and AI feedback are kept while the account remains active and are deleted when the user completes the in-product account deletion process, subject to limited legal, fraud-prevention, transaction-record, backup, or security exceptions. Browser-only information remains until you clear site data or delete your account from that browser. Authentication, payment, hosting, AI-provider logs, backups, and legally required transaction records follow the applicable providers’ retention schedules.</p>
        </section>

        <section>
          <h2>Your choices and privacy rights</h2>
          <p>From the Account page, you can correct your username, choose whether to appear on the leaderboard, download server-stored data, and permanently delete your account and roleplay history. Depending on where you live, you may also have rights to know, access, correct, delete, restrict, object, or appeal, and to receive equal service when exercising a privacy right.</p>
          <p>To exercise a right that is not available in the Account page, use an authorized agent, or ask a question, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may need to verify your identity. We do not discriminate against users for exercising privacy rights.</p>
        </section>

        <section>
          <h2>Students, schools, and children</h2>
          <p>Deca Pal is intended for users age 13 and older. Users under the age of legal majority should use it only with permission from a parent or guardian. We do not knowingly collect personal information from a child under 13. If you believe a child under 13 has used the service, contact us so we can delete the information.</p>
          <p>If a school uses Deca Pal for an educational purpose, the school and Deca Pal must separately determine and document their responsibilities under FERPA and applicable state student-privacy laws. A public website policy alone is not a school data-processing agreement.</p>
        </section>

        <section>
          <h2>Security and transfers</h2>
          <p>We use access controls, encrypted transport, server-only database access, secure authentication tokens, input limits, and dependency monitoring. No security measure is perfect. Firebase, Clerk, Stripe, and other providers may process information in the United States or other locations where they operate.</p>
        </section>

        <section>
          <h2>Changes and contact</h2>
          <p>We will post material changes here with a new effective date and provide additional notice when required. Questions may be sent to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          <p className="mt-4">See also our <Link href="/terms">Terms of Use</Link> and <Link href="/accessibility">Accessibility Statement</Link>.</p>
        </section>
      </div>
    </article>
  )
}
