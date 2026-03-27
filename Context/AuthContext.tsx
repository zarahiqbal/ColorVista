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
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';

// 1. UPDATE: Expanded User interface to support Guest properties
interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cvdType?: string;
  role: 'user' | 'admin' | 'guest';
  isGuest: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
  signUp: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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
          // Fetch user profile from Realtime Database
          try {
            const userRef = ref(db, `users/${fbUser.uid}`);
            const snapshot = await get(userRef);
            let profile: User;
            
            if (snapshot.exists()) {
              profile = snapshot.val() as User;
              profile.uid = fbUser.uid;
            } else {
              // Create a new profile if it doesn't exist
              const names = (fbUser.displayName || '').split(' ');
              profile = {
                uid: fbUser.uid,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: fbUser.email || '',
                role: 'user',
                isGuest: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              await set(userRef, profile);
            }
            
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

      // Create user profile in Realtime Database
      const profile: User = {
        uid: credential.user.uid,
        firstName,
        lastName,
        email,
        phone,
        cvdType: 'normal',
        role: 'user',
        isGuest: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Realtime Database
      const userRef = ref(db, `users/${credential.user.uid}`);
      await set(userRef, profile);
      
      setUser(profile);
      await saveUser(profile);
    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // profile will be loaded by onAuthStateChanged listener; return for convenience
      return;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loginAsGuest, signUp, signIn, isLoading }}>
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