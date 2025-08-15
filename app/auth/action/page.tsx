'use client'

import { useState, useEffect, Suspense } from 'react';
import { 
  confirmPasswordReset, 
  verifyPasswordResetCode,
  applyActionCode,
  checkActionCode
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthActionContent() {
  const [mode, setMode] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    setMode(mode || '');
    setActionCode(oobCode || '');

    const handleAction = async () => {
      if (!mode || !oobCode) {
        setError('Invalid or missing action parameters.');
        setVerifying(false);
        return;
      }

      try {
        switch (mode) {
          case 'resetPassword':
            // Verify the password reset code
            const email = await verifyPasswordResetCode(auth, oobCode);
            setUserEmail(email);
            setIsValidCode(true);
            break;
            
          case 'verifyEmail':
            // Apply the email verification code
            await applyActionCode(auth, oobCode);
            setSuccess('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
            break;
            
          case 'recoverEmail':
            // Check the action code for email recovery
            const info = await checkActionCode(auth, oobCode);
            if (info.data.email) {
              await applyActionCode(auth, oobCode);
              setSuccess('Email recovered successfully!');
            }
            break;
            
          default:
            setError('Unknown action type.');
        }
      } catch (err: any) {
        console.error('Action error:', err);
        if (err.code === 'auth/expired-action-code') {
          setError('This link has expired. Please request a new one.');
        } else if (err.code === 'auth/invalid-action-code') {
          setError('This link is invalid. Please request a new one.');
        } else if (err.code === 'auth/user-disabled') {
          setError('This user account has been disabled.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } finally {
        setVerifying(false);
      }
    };

    handleAction();
  }, [searchParams, router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!actionCode) {
      setError('Invalid reset code');
      return;
    }

    setIsLoading(true);

    try {
      // Reset the password
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/expired-action-code') {
        setError('This password reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('This password reset link is invalid. Please request a new one.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Processing your request...</p>
        </div>
      </div>
    );
  }

  // Handle email verification success
  if (mode === 'verifyEmail' && success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-4xl font-light text-gray-800 dark:text-white">Email Verified!</h2>
          <div className="text-sm text-green-600 dark:text-green-400 my-4">
            {success}
          </div>
          <Link 
            href="/login" 
            className="inline-block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Handle password reset form
  if (mode === 'resetPassword' && isValidCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-light mb-4 text-center text-gray-800 dark:text-white">
              Set new password
            </h2>
            {userEmail && (
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Reset password for: <strong>{userEmail}</strong>
              </p>
            )}
          </div>
          <form className="space-y-6" onSubmit={handlePasswordReset}>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 px-4 py-3 rounded-[15px]">
                {success}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="password"
                required
                className="input-minimal"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading || !!success}
                minLength={6}
              />
              <input
                type="password"
                required
                className="input-minimal"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !!success}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full py-3 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
          {!success && (
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle errors or unknown states
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h2 className="text-4xl font-light text-gray-800 dark:text-white">Action Required</h2>
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-600 dark:text-green-400 my-4">
            {success}
          </div>
        )}
        <div className="space-y-2">
          {mode === 'resetPassword' && (
            <Link 
              href="/forgot-password" 
              className="block text-[#0066cc] dark:text-[#4d94ff] hover:text-[#0052a3] dark:hover:text-[#6ba3ff] font-semibold transition-colors duration-300"
            >
              Request a new password reset
            </Link>
          )}
          <Link 
            href="/login" 
            className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthAction() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthActionContent />
    </Suspense>
  );
}