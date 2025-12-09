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
    console.log('📝 Updating CVD type in Firebase for user:', uid);
    console.log('CVD Type value:', cvdType);

    // Update in Firebase Realtime Database
    const userRef = ref(db, `users/${uid}`);
    console.log('User ref path:', `users/${uid}`);
    
    const updateData = {
      cvdType: cvdType,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Update data:', updateData);
    await update(userRef, updateData);
    console.log('✅ Firebase update completed');

    // Update in local storage
    const cachedUser = await AsyncStorage.getItem('@user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      console.log('📱 Updating local storage. Previous cvdType:', user.cvdType);
      user.cvdType = cvdType;
      user.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      console.log('✅ Local storage updated. New cvdType:', user.cvdType);
    } else {
      console.log('⚠️ No cached user found in AsyncStorage');
    }

    console.log('✅ CVD type updated successfully:', cvdType);
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
