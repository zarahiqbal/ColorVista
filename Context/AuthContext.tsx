// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'user' | 'admin';
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // Load user from AsyncStorage on app start
//   useEffect(() => {
//     loadUser();
//   }, []);

//   // Save user to AsyncStorage whenever it changes
//   useEffect(() => {
//     if (user) {
//       saveUser(user);
//     } else {
//       removeUser();
//     }
//   }, [user]);

//   const loadUser = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('@user');
//       if (userData) {
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Error loading user:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const saveUser = async (userData: User) => {
//     try {
//       await AsyncStorage.setItem('@user', JSON.stringify(userData));
//     } catch (error) {
//       console.error('Error saving user:', error);
//     }
//   };

//   const removeUser = async () => {
//     try {
//       await AsyncStorage.removeItem('@user');
//     } catch (error) {
//       console.error('Error removing user:', error);
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     await removeUser();
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    reload,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import type { DocumentData } from 'firebase/firestore';
import {
    fetchUserProfileDoc,
    writeUserProfile,
    type UserGamesDoc,
} from './userProfileFirestore';

// 1. UPDATE: Expanded User interface to support Guest properties
export const AUTH_EMAIL_NOT_VERIFIED = 'auth/email-not-verified';

interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cvdType?: string;
  photoURL?: string;
  games?: UserGamesDoc;
  emailVerified?: boolean;
  role: 'user' | 'admin' | 'guest';
  isGuest: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function firestoreDataToUser(uid: string, data: DocumentData): User {
  return {
    uid,
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    email: String(data.email ?? ''),
    phone: data.phone != null ? String(data.phone) : undefined,
    cvdType: data.cvdType != null ? String(data.cvdType) : undefined,
    photoURL: data.photoURL != null ? String(data.photoURL) : undefined,
    games: (data.games as UserGamesDoc | undefined) ?? undefined,
    role: (data.role as User['role']) ?? 'user',
    isGuest: false,
    createdAt: data.createdAt != null ? String(data.createdAt) : undefined,
    updatedAt: data.updatedAt != null ? String(data.updatedAt) : undefined,
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
  signUp: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load cached user initially and subscribe to Firebase auth state
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const cached = await AsyncStorage.getItem('@user');
        if (cached && mounted) {
          setUser(JSON.parse(cached));
        }
      } catch (e) {
        // ignore
      }

      // Listen to Firebase auth changes
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            try {
              await reload(fbUser);
            } catch {
              /* offline / transient; continue with current token state */
            }
            const snapshot = await fetchUserProfileDoc(fbUser.uid);
            let profile: User;

            if (snapshot.exists()) {
              profile = firestoreDataToUser(fbUser.uid, snapshot.data());
            } else {
              const names = (fbUser.displayName || '').split(' ');
              profile = {
                uid: fbUser.uid,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: fbUser.email || '',
                role: 'user',
                isGuest: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                photoURL: fbUser.photoURL || undefined,
              };
              await writeUserProfile(fbUser.uid, profile as unknown as DocumentData);
            }

            profile.emailVerified = fbUser.emailVerified;

            if (mounted) {
              setUser(profile);
              await AsyncStorage.setItem('@user', JSON.stringify(profile));
            }
          } catch (err) {
            console.error('Error loading profile:', err);
          }
        } else {
          // User signed out
          if (mounted) {
            setUser(null);
            await AsyncStorage.removeItem('@user');
          }
        }
        if (mounted) setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubPromise = init();

    return () => {
      mounted = false;
      unsubPromise.then((unsubscribe: any) => {
        if (typeof unsubscribe === 'function') unsubscribe();
      }).catch(() => {});
    };
  }, []);

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      firstName: 'Guest',
      lastName: 'User',
      email: '',
      role: 'guest',
      isGuest: true,
    };
    setUser(guestUser);
    saveUser(guestUser);
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase sign out error:', err);
    }
    setUser(null);
    await removeUser();
  };

  const signUp = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { firstName, lastName, email, phone, password } = data;
    try {
      // Create user in Firebase Auth
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update auth user's display name
      await updateProfile(credential.user, { displayName: `${firstName} ${lastName}` });

      const profile: User = {
        uid: credential.user.uid,
        firstName,
        lastName,
        email,
        phone,
        cvdType: 'Normal Vision',
        role: 'user',
        isGuest: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await writeUserProfile(credential.user.uid, profile as unknown as DocumentData);

      await sendEmailVerification(credential.user);
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await reload(credential.user);

      if (!credential.user.emailVerified) {
        await firebaseSignOut(auth);
        const err = new Error(
          'Please verify your email using the link we sent you, then sign in again.',
        );
        (err as { code?: string }).code = AUTH_EMAIL_NOT_VERIFIED;
        throw err;
      }

      const snapshot = await fetchUserProfileDoc(credential.user.uid);
      let profile: User;

      if (snapshot.exists()) {
        profile = firestoreDataToUser(credential.user.uid, snapshot.data());
      } else {
        const names = (credential.user.displayName || '').split(' ');
        profile = {
          uid: credential.user.uid,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: credential.user.email || email,
          role: 'user',
          isGuest: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await writeUserProfile(credential.user.uid, profile as unknown as DocumentData);
      }

      profile.emailVerified = credential.user.emailVerified;

      setUser(profile);
      await saveUser(profile);
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      throw new Error('Email is required');
    }
    await sendPasswordResetEmail(auth, trimmed);
  };

  const resendVerificationEmail = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    await reload(cred.user);
    if (cred.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('This email is already verified. Try signing in.');
    }
    await sendEmailVerification(cred.user);
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loginAsGuest,
        signUp,
        signIn,
        requestPasswordReset,
        resendVerificationEmail,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};