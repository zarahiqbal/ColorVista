import AsyncStorage from '@react-native-async-storage/async-storage';
import { patchUserProfile } from './userProfileFirestore';

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

    await patchUserProfile(uid, {
      cvdType,
      updatedAt: new Date().toISOString(),
    });

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
