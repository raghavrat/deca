'use client'

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setSuccess('Please check your email for verification before logging in');
      setError('');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            Create an account
          </h2>
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
            className="btn btn-primary w-full"
          >
            Sign up
          </button>
        </form>
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-[#0066cc] hover:text-[#0052a3] font-semibold transition-colors duration-300"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 