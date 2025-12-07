import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomNavBar from "../components/BottomNavBar"; // Ensure path is correct

export default function MainLayout() {
  return (
    <View style={styles.container}>
      {/* 1. The Screen Content (Dashboard, Profile, or Settings) */}
      <View style={styles.content}>
        <Slot /> 
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