import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, update } from 'firebase/database';
import { db } from './firebase';

/**
 * Update user's CVD type in Firebase and local storage
 * @param uid - User's Firebase UID
 * @param cvdType - The detected CVD type (e.g., "Protanopia / Deuteranopia", "Tritanopia", "Normal Vision")
 */
export const updateUserCVDType = async (uid: string, cvdType: string): Promise<void> => {
  if (!uid) {
    throw new Error('User UID is required');
  }

  if (!cvdType) {
    throw new Error('CVD type is required');
  }

  try {

    // Update in Firebase Realtime Database
    const userRef = ref(db, `users/${uid}`);
    
    const updateData = {
      cvdType: cvdType,
      updatedAt: new Date().toISOString()
    };
    
    await update(userRef, updateData);

    // Update in local storage
    const cachedUser = await AsyncStorage.getItem('@user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      user.cvdType = cvdType;
      user.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } else {
      console.log('⚠️ No cached user found in AsyncStorage');
    }

  } catch (error) {
    console.error('❌ Error updating CVD type:', error);
    throw error;
  }
};

/**
 * Get the CVD type for a user
 * @param uid - User's Firebase UID
 */
export const getUserCVDType = async (uid: string): Promise<string | null> => {
  if (!uid) {
    return null;
  }

  try {
    const cachedUser = await AsyncStorage.getItem('@user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      return user.cvdType || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching CVD type:', error);
    return null;
  }
};
