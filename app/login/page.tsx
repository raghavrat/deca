'use client'

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to sign in');
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
              className="w-full px-6 py-4 rounded-[15px] border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#06C167] focus:border-transparent"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#06C167] focus:border-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Sign in
          </button>
        </form>
        <div className="text-center">
          <Link 
            href="/signup" 
            className="text-[#06C167] hover:text-[#05a75a] font-semibold transition-colors duration-300"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 