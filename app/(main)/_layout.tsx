import { useTheme } from '@/Context/ThemeContext';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import BottomNavBar from "../components/BottomNavBar"; // Ensure path is correct

export default function MainLayout() {
  const { darkMode } = useTheme();
  const backgroundColor = darkMode ? '#1C1C1E' : '#F6F3EE';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* 1. The Screen Content (Dashboard, Profile, or Settings) */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor },
          }}
        />
      </View>

      {/* 2. The Persistent Bottom Bar */}
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, // Takes up all space above the bar
  },
});