'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from './firebase';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile } from './types';
import { Loader2 } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: 'Admin' | 'Student' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, role: 'Admin' | 'Student') => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<'Admin' | 'Student' | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          setUserRole(profile.role);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (userRole) {
      if (isAuthPage) {
        router.push(userRole === 'Admin' ? '/dashboard' : '/student-dashboard');
      } else if (userRole === 'Admin' && (pathname.startsWith('/student-dashboard'))) {
        router.push('/dashboard');
      } else if (userRole === 'Student' && (pathname.startsWith('/dashboard'))) {
        router.push('/student-dashboard');
      }
    } else if (!isAuthPage && pathname !== '/') {
      router.push('/login');
    }
  }, [userRole, loading, pathname, router]);

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, role: 'Admin' | 'Student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role,
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    setUserProfile(userProfile);
    setUserRole(role);
    return userCredential;
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const value = { user, userProfile, userRole, loading, signIn, signUp, signOut };

  if (loading && pathname !== '/') {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);
  
    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }
  
    return <>{children}</>;
  };
