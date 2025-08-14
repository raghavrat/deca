'use client'

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
      setEmailSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
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
      setSuccess('Password reset email resent! Check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">
            Reset your password
          </h2>
          <p className="text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[15px]">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[15px]">
              {success}
            </div>
          )}
          <div>
            <input
              type="email"
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || emailSent}
            />
          </div>

          {!emailSent ? (
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset email'}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resending...' : 'Resend email'}
              </button>
              <p className="text-sm text-center text-gray-600">
                Didn't receive the email? Check your spam folder or click resend.
              </p>
            </div>
          )}
        </form>
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-[#0066cc] hover:text-[#0052a3] font-semibold transition-colors duration-300"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}