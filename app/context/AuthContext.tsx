'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { isEmailAllowed } from '../config/allowedEmails';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Only create session if user just signed in (not on every auth state change)
        // The signIn method already handles session creation
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isEmailAllowed(email)) {
      throw new Error('This email domain is not allowed to register');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create a user document in Firestore
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      email: userCredential.user.email,
      name: '', // Initially empty, user can set it in their account page
      problemsCompleted: 0,
      createdAt: new Date(),
    });

    await sendEmailVerification(userCredential.user);
    return true;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.uid);
  
      const idToken = await userCredential.user.getIdToken();
      console.log('ID token obtained');
  
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      const sessionData = await sessionResponse.json();
      console.log('Session creation response:', sessionData);
  
      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }
  
      // Force a page reload to ensure the session cookie is properly recognized
      // This prevents race conditions between client auth and server session
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

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 