'use client'

import { SignUp } from '@clerk/nextjs'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { getErrorMessage, getErrorCode } from '../utils/errorHandling';
import { isClerkClientEnabled } from '../config/authProvider';
import AuthPageShell from '../components/AuthPageShell';
import { PRIVACY_POLICY_VERSION } from '../utils/clerkConsent';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clerkConsentAt, setClerkConsentAt] = useState('');
  const { signUp } = useAuth();

  if (isClerkClientEnabled()) {
    if (clerkConsentAt) {
      return (
        <AuthPageShell>
          <SignUp
            routing="hash"
            signInUrl="/login"
            fallbackRedirectUrl="/performance"
            unsafeMetadata={{
              age13Confirmed: true,
              termsAcceptedAt: clerkConsentAt,
              privacyPolicyVersion: PRIVACY_POLICY_VERSION,
            }}
          />
        </AuthPageShell>
      )
    }

    return (
      <AuthPageShell>
        <div className="w-full space-y-8">
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Create your account
          </h1>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input id="clerk-age-confirmation" type="checkbox" checked={ageConfirmed} onChange={event => setAgeConfirmed(event.target.checked)} className="mt-1 h-5 w-5" />
                <label htmlFor="clerk-age-confirmation" className="text-sm leading-6">I am at least 13 years old. If I am under the age of legal majority, my parent or guardian has permitted me to use Deca Pal.</label>
              </div>
              <div className="flex items-start gap-3">
                <input id="clerk-terms-confirmation" type="checkbox" checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} className="mt-1 h-5 w-5" />
                <label htmlFor="clerk-terms-confirmation" className="text-sm leading-6">I agree to the <Link href="/terms" className="underline underline-offset-2">Terms of Use</Link> and acknowledge the <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</label>
              </div>
            </div>
            <button
              type="button"
              disabled={!ageConfirmed || !termsAccepted}
              onClick={() => setClerkConsentAt(new Date().toISOString())}
              className="w-full border border-white bg-white px-5 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-500"
            >
              Continue
            </button>
          </div>
          <div className="text-center">
            <Link href="/login" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </AuthPageShell>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters');
      return;
    }

    if (!ageConfirmed || !termsAccepted) {
      setError('Confirm your age and accept the Terms and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const emailSent = await signUp(email, password, username, ageConfirmed, termsAccepted);
      if (emailSent) {
        setSuccess('Account created! Please check your email to verify your account.');
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setAgeConfirmed(false);
        setTermsAccepted(false);
      }
    } catch (err: unknown) {
      console.error('Signup error:', err);
      const errorCode = getErrorCode(err);
      const errorMessage = getErrorMessage(err);
      
      if (errorCode === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(errorMessage || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="w-full space-y-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-center text-black dark:text-white">
            Create your account
          </h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div id="signup-error" role="alert" className="text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="text-sm text-green-700 dark:text-green-400">
              {success}
            </div>
          )}
          <div className="space-y-4">
            <div><label htmlFor="signup-username" className="mb-1 block text-sm font-medium">Username</label><input id="signup-username" type="text" required autoComplete="username" maxLength={64} className="input-minimal" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
            <div><label htmlFor="signup-email" className="mb-1 block text-sm font-medium">Email address</label><input id="signup-email" type="email" required autoComplete="email" maxLength={254} className="input-minimal" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label htmlFor="signup-password" className="mb-1 block text-sm font-medium">Password</label><input id="signup-password" type="password" required autoComplete="new-password" minLength={12} aria-describedby="password-help" className="input-minimal" value={password} onChange={(e) => setPassword(e.target.value)} /><p id="password-help" className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Use at least 12 characters. Password managers and paste are supported.</p></div>
            <div><label htmlFor="signup-confirm-password" className="mb-1 block text-sm font-medium">Confirm password</label><input id="signup-confirm-password" type="password" required autoComplete="new-password" minLength={12} className="input-minimal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3"><input id="age-confirmation" type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} required className="mt-1 h-5 w-5" /><label htmlFor="age-confirmation" className="text-sm leading-6">I am at least 13 years old. If I am under the age of legal majority, my parent or guardian has permitted me to use Deca Pal.</label></div>
            <div className="flex items-start gap-3"><input id="terms-confirmation" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required className="mt-1 h-5 w-5" /><label htmlFor="terms-confirmation" className="text-sm leading-6">I agree to the <Link href="/terms" className="underline underline-offset-2">Terms of Use</Link> and acknowledge the <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.</label></div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success !== '' || !ageConfirmed || !termsAccepted}
            className="w-full py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}
