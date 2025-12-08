import { useAuth } from '@/Context/AuthContext';
import { useUserData } from '@/Context/useUserData';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface UserInfoDisplayProps {
  showEmail?: boolean;
  showRole?: boolean;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Component to display logged-in user information from Firebase
 * Shows "Guest" or actual user data depending on login status
 */
export const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({
  showEmail = false,
  showRole = false,
  textColor = '#000000',
  size = 'medium'
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();

  const isGuest = user?.isGuest === true;
  const loading = authLoading || userDataLoading;

  const sizeConfig = {
    small: { nameSize: 12, emailSize: 10 },
    medium: { nameSize: 16, emailSize: 12 },
    large: { nameSize: 20, emailSize: 14 }
  };

  const { nameSize, emailSize } = sizeConfig[size];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={textColor} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={[styles.name, { color: textColor, fontSize: nameSize }]}>
          Not Logged In
        </Text>
      </View>
    );
  }

  const displayName = isGuest
    ? 'Guest User'
    : `${userData?.firstName || user.firstName || ''} ${userData?.lastName || user.lastName || ''}`.trim();

  const displayEmail = userData?.email || user.email;
  const displayRole = userData?.role || user.role;

  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: textColor, fontSize: nameSize, fontWeight: 'bold' }]}>
        {displayName}
      </Text>

      {showEmail && displayEmail && (
        <Text style={[styles.detail, { color: textColor, fontSize: emailSize, opacity: 0.8 }]}>
          {displayEmail}
        </Text>
      )}

      {showRole && displayRole !== 'guest' && (
        <Text style={[styles.detail, { color: textColor, fontSize: emailSize, opacity: 0.7 }]}>
          Role: {displayRole}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  name: {
    fontWeight: '500',
  },
  detail: {
    marginTop: 2,
  },
});
