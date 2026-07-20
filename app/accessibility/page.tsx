import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Accessibility Statement' }
const contactEmail = process.env.PRIVACY_CONTACT_EMAIL || 'privacy@decapal.org'

export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 text-gray-800 dark:text-gray-200">
      <header className="mb-12 border-b border-gray-200 pb-8 dark:border-gray-800">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Last updated July 20, 2026</p>
        <h1 className="text-4xl font-light tracking-tight text-black dark:text-white">Accessibility Statement</h1>
      </header>
      <div className="legal-copy space-y-10">
        <section><h2>Our commitment</h2><p>Deca Pal aims to provide an inclusive experience for students and visitors with disabilities. Our engineering target is the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p></section>
        <section><h2>Measures taken</h2><ul><li>Keyboard-accessible navigation and visible focus indicators</li><li>Programmatic form labels, instructions, and status or error announcements</li><li>A skip link and semantic page regions</li><li>Reduced-motion support and user-controlled carousel movement</li><li>Text alternatives for meaningful images and names for icon controls</li><li>Responsive layouts, scalable text, and light/dark contrast checks</li></ul></section>
        <section><h2>Conformance status</h2><p>The site is being remediated toward WCAG 2.2 AA and is not yet making a certified full-conformance claim. Automated checks cannot identify every barrier, so keyboard, screen-reader, zoom/reflow, contrast, and user testing should be repeated before each major release.</p></section>
        <section><h2>Feedback and accommodations</h2><p>If you encounter a barrier or need information in another format, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Include the page, the problem, the browser or assistive technology used, and the format you need. We will make reasonable efforts to respond promptly.</p></section>
      </div>
    </article>
  )
}
