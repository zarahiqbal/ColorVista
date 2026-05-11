import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { Alert } from 'react-native';

// Adjust path if your file structure is different
import LiveScreen from '../screens/LiveScreen'; 

export default function LiveRoute() {
  const [active, setActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Leaving Live (back to home, etc.) must stop detection like tapping Stop Analysis.
  useFocusEffect(
    useCallback(() => {
      return () => {
        setActive(false);
      };
    }, []),
  );

  const handleToggleCamera = async () => {
    // 1. Check Permissions
    if (!permission) return;

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required", 
          "We need access to your camera to run live detection."
        );
        return;
      }
    }

    // 2. Toggle State
    setActive((prev) => !prev);
  };

  return (
    <LiveScreen 
      active={active}
      permission={permission}
      onRequestPermission={requestPermission}
      onToggleCamera={handleToggleCamera}
      facing="back"
    />
  );
}