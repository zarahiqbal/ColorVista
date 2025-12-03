import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Import the screen component from the screens folder
import MediaUploadScreen from '../screens/MediaUpload';

export default function MediaUploadRoute() {
  return (
    <View style={styles.container}>
      {/* 1. We added StatusBar here (from your code) to ensure light content 
           on the dark background.
      */}
      <StatusBar style="light" />

      {/* 2. Instead of a Navigator, we use Stack.Screen to configure 
           the current screen's options.
      */}
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: "Media Upload",
          contentStyle: { backgroundColor: '#121212' }
        }} 
      />
      
      {/* 3. We render the screen component directly.
           No NavigationContainer or Stack.Navigator is needed.
      */}
      <MediaUploadScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});