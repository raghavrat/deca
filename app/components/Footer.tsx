import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-4 py-8 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="font-medium text-black dark:text-white">Deca Pal</p>
          <p className="mt-2 leading-6">
            An independent study tool. Deca Pal is not affiliated with or endorsed by DECA Inc. Practice materials and scores are not official competition results.
          </p>
        </div>
        <nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-3">
          <Link className="underline-offset-4 hover:underline" href="/privacy">Privacy</Link>
          <Link className="underline-offset-4 hover:underline" href="/terms">Terms</Link>
          <Link className="underline-offset-4 hover:underline" href="/accessibility">Accessibility</Link>
        </nav>
      </div>
    </footer>
  )
}
