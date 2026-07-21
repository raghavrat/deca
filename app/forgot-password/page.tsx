'use client'

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess('If an account exists for that address, a reset email has been sent.');
      setEmailSent(true);
    } catch {
      // Use the same response whether or not the account exists.
      setSuccess('If an account exists for that address, a reset email has been sent.');
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess('If an account exists for that address, a reset email has been sent.');
    } catch {
      setSuccess('If an account exists for that address, a reset email has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-4xl font-light mb-4 text-center text-neutral-800 dark:text-white">
            Reset your password
          </h1>
          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div role="alert" className="text-sm text-red-700 dark:text-red-400 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="text-sm text-green-700 dark:text-green-400 mb-4">
              {success}
            </div>
          )}
          <div>
            <label htmlFor="reset-email" className="mb-1 block text-sm font-medium">Email address</label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              className="input-minimal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || emailSent}
            />
          </div>

          {!emailSent ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset email'}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="w-full py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resending...' : 'Resend email'}
              </button>
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                Didn't receive the email? Check your spam folder or click resend.
              </p>
            </div>
          )}
        </form>
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
