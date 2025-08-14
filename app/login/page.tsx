'use client'

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigation is handled in the signIn method
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.message && err.message.includes('Email not verified')) {
        setError('Please verify your email before signing in');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[15px]">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center space-y-2">
          <Link 
            href="/forgot-password" 
            className="text-[#0066cc] hover:text-[#0052a3] font-semibold transition-colors duration-300 block"
          >
            Forgot your password?
          </Link>
          <Link 
            href="/signup" 
            className="text-[#0066cc] hover:text-[#0052a3] font-semibold transition-colors duration-300 block"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 