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

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. UPDATE: Expanded User interface to support Guest properties
interface User {
  firstName: string;
  lastName: string;
  email: string;
  // Added 'guest' to the role union type
  role: 'user' | 'admin' | 'guest'; 
  // Added isGuest flag (mandatory for our logic)
  isGuest: boolean; 
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  // 2. UPDATE: Added helper function definition
  loginAsGuest: () => void; 
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      saveUser(user);
    } else {
      removeUser();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // 3. UPDATE: Implement the Guest Login logic
  const loginAsGuest = () => {
    const guestUser: User = {
      firstName: 'Guest',
      lastName: 'User',
      email: '', // Empty email for guests
      role: 'guest',
      isGuest: true,
    };
    setUser(guestUser);
    // The useEffect above will automatically save this to AsyncStorage
    // so the user stays logged in as a guest if they close the app.
  };

  const logout = async () => {
    setUser(null);
    await removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loginAsGuest, isLoading }}>
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