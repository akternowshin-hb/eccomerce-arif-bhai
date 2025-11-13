'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  FacebookAuthProvider,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';


// Define types
interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        await loadUserData(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Check for redirect result (for mobile/popup blocked)
    checkRedirectResult();

    return () => unsubscribe();
  }, []);

  // Check for redirect result
  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // User successfully signed in with redirect
        await handleSocialLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('Redirect result error:', error);
    }
  };

  // Load user data from Firestore
  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: userData.fullName || firebaseUser.displayName || '',
          phone: userData.phone || '',
          avatar: firebaseUser.photoURL || '',
        });
      } else {
        // If user document doesn't exist, create basic user object
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
          phone: '',
          avatar: firebaseUser.photoURL || '',
        });
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
      
      // If offline or Firestore error, still set user from Firebase Auth
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || '',
        phone: '',
        avatar: firebaseUser.photoURL || '',
      });
    }
  };

  // Handle successful social login
  const handleSocialLoginSuccess = async (firebaseUser: FirebaseUser) => {
    try {
      // Try to check if user document exists
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        // Create user document
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          fullName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          phone: '',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      // Continue anyway - user is authenticated in Firebase Auth
    }
  };

  // Register with email and password
  const register = async (userData: RegisterData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: userData.fullName
      });

      // Save additional user data to Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error('Firestore save error:', firestoreError);
        // Continue anyway - user is created in Firebase Auth
      }

      router.push('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  };

  // Login with Google (with fallback to redirect)
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        await handleSocialLoginSuccess(result.user);
        router.push('/');
      } catch (popupError: any) {
        // If popup is blocked, use redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('popup')) {
          console.log('Popup blocked, using redirect...');
          await signInWithRedirect(auth, provider);
          // Redirect result will be handled in checkRedirectResult
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelled');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Ignore - user is being redirected
        return;
      } else {
        throw new Error('Google login failed. Please try again.');
      }
    }
  };

  // Login with Facebook (with fallback to redirect)
  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        await handleSocialLoginSuccess(result.user);
        router.push('/');
      } catch (popupError: any) {
        // If popup is blocked, use redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('popup')) {
          console.log('Popup blocked, using redirect...');
          await signInWithRedirect(auth, provider);
          // Redirect result will be handled in checkRedirectResult
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('Facebook login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelled');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Ignore - user is being redirected
        return;
      } else {
        throw new Error('Facebook login failed. Please try again.');
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}