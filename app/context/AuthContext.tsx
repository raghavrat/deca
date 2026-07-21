'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, ageConfirmed: boolean, termsAccepted: boolean) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      // First check if we have a valid session
      let hasValidSession = false;
      try {
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData.user) {
            hasValidSession = true;
          }
        }
      } catch {
        // A missing session is expected for signed-out visitors.
      }
      
      // Set up Firebase auth state listener
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
        } else if (hasValidSession) {
          // Session exists but Firebase auth state is null
          // This can happen on page refresh - Firebase auth needs time to restore state
          
          // Give Firebase a moment to restore auth state
          setTimeout(async () => {
            await auth.authStateReady();
            if (auth.currentUser) {
              setUser(auth.currentUser);
            } else {
              // If still no user after waiting, the session might be stale
              setUser(null);
            }
            setLoading(false);
          }, 1000);
          return; // Don't set loading to false yet
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, ageConfirmed: boolean, termsAccepted: boolean) => {
    if (!ageConfirmed || !termsAccepted) {
      throw new Error('Age and policy confirmations are required')
    }
    const eligibilityResponse = await fetch('/api/auth/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!eligibilityResponse.ok) {
      throw new Error('Enter a valid email address')
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name in Firebase Auth
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    // Create a user document in Firestore with the name
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      email: userCredential.user.email,
      name: name,
      displayName: name, // Store both for compatibility
      problemsCompleted: 0,
      leaderboardVisible: false,
      age13Confirmed: true,
      termsAcceptedAt: new Date(),
      privacyPolicyVersion: '2026-07-20',
      createdAt: new Date(),
    });

    await sendEmailVerification(userCredential.user);
    return true;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
  
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      const sessionData = await sessionResponse.json();
      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || 'Failed to create session');
      }
  
      // Use window.location.href to ensure full page reload and proper cookie handling
      window.location.href = '/';
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
