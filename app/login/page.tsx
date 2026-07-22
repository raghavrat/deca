'use client'

import { SignIn } from '@clerk/nextjs'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { getErrorMessage, getErrorCode } from '../utils/errorHandling';
import { isClerkClientEnabled } from '../config/authProvider';
import AuthPageShell from '../components/AuthPageShell';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  if (isClerkClientEnabled()) {
    return (
      <AuthPageShell>
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          fallbackRedirectUrl="/performance"
        />
      </AuthPageShell>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigation is handled in the signIn method
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorCode = getErrorCode(err);
      const errorMessage = getErrorMessage(err);
      
      if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorMessage.includes('Email not verified')) {
        setError('Please verify your email before signing in');
      } else {
        setError('Failed to sign in. Please try again.');
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
            Sign in to your account
          </h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div role="alert" id="login-error" className="text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email address</label>
              <input id="login-email" type="email" required autoComplete="email" maxLength={254} className="input-minimal" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby={error ? 'login-error' : undefined} />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="login-password" type="password" required autoComplete="current-password" className="input-minimal" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby={error ? 'login-error' : undefined} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center space-y-2">
          <Link 
            href="/forgot-password" 
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 block"
          >
            Forgot your password?
          </Link>
          <Link 
            href="/signup" 
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 block"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}
