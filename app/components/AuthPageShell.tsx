interface AuthPageShellProps {
  children: React.ReactNode
}

export default function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <section className="auth-page" aria-label="Account access">
      <div className="auth-shell">
        <div className="auth-form-panel">
          <div className="auth-form-content">{children}</div>
        </div>
      </div>
    </section>
  )
}
