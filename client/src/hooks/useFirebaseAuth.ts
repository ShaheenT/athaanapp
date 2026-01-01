import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isConfigured] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    if (!auth || !isConfigured) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('firebaseToken', idToken);
        } else {
          setToken(null);
          localStorage.removeItem('firebaseToken');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth state listener error:', error);
      setLoading(false);
    }
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!auth || !isConfigured) {
      return { 
        success: false, 
        error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.' 
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseToken', idToken);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    if (!auth || !isConfigured) {
      localStorage.removeItem('firebaseToken');
      return { success: true };
    }

    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('firebaseToken');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    token,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isConfigured
  };
}
