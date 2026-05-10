import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker"; // 1. Import ImagePicker
import { Stack, useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ref, update as updateDb } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage"; // 2. Storage imports
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/Context/AuthContext";
import { auth, db, storage } from "@/Context/firebase"; // Ensure 'storage' is exported from firebase config
import { useUserData } from "@/Context/useUserData";
import { useTheme } from "../Context/ThemeContext";

// Define available system avatars (just geometric/color representations for this UI)
const SYSTEM_AVATARS = [
  { id: "av1", bgColor: "#8DA399", deco: "#AA957B" }, // Sage w/ Taupe dots
  { id: "av2", bgColor: "#AA957B", deco: "#8DA399" }, // Taupe w/ Sage dots
  { id: "av3", bgColor: "#2F2F2F", deco: "#FFFFFF" }, // Charcoal w/ White dots
  { id: "av4", bgColor: "#C25B5B", deco: "#F6F3EE" }, // Error red w/ light dots
];

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout, setUser } = useAuth();
  const { userData } = useUserData();
  const isGuest = user?.isGuest === true;
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // Local state for the displayed image (handles URI or system avatar object)
  const [currentPhoto, setCurrentPhoto] = React.useState<any>(null);
  const [uploading, setUploading] = React.useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = React.useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [updatingPassword, setUpdatingPassword] = React.useState(false);

  const palette = {
    beigeBg: "#F6F3EE",
    charcoal: "#2F2F2F",
    sage: "#8DA399",
    taupe: "#AA957B",
    white: "#FFFFFF",
    textLight: "#6B6661",
    error: "#C25B5B",
  };

  const theme = {
    bg: darkMode ? "#1C1C1E" : palette.beigeBg,
    card: darkMode ? "#2C2C2E" : palette.white,
    text: darkMode ? "#F6F3EE" : palette.charcoal,
    subText: darkMode ? "#A1A1AA" : palette.textLight,
    border: darkMode ? "#333" : "#E5E5E5",
    primary: palette.charcoal,
    accent: palette.taupe,
    modalOverlay: "rgba(0, 0, 0, 0.7)",
  };

  const getInitialUsername = () => {
    if (isGuest) return "Guest Explorer";
    if (userData)
      return `${userData.firstName || "User"} ${userData.lastName || "Profile"}`;
    return `${user?.firstName || ""} ${user?.lastName || ""}`;
  };

  const [username, setUsername] = React.useState(getInitialUsername);
  const email = isGuest
    ? "Not Linked"
    : userData?.email || user?.email || "alex.doe@email.com";
  const phone = isGuest
    ? "Not Linked"
    : userData?.phone || user?.phone || "Not provided";
  const [colorblindnessType, setColorblindnessType] = React.useState(
    userData?.cvdType || user?.cvdType || "Normal Vision",
  );

  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [tempUsername, setTempUsername] = React.useState(username);

  // Initialize photo from userData or auth
  React.useEffect(() => {
    const sourcePhotoURL = userData?.photoURL ?? (user as any)?.photoURL;
    if (!sourcePhotoURL) return;

    if (sourcePhotoURL.startsWith("system:")) {
      try {
        const avatarData = JSON.parse(sourcePhotoURL.substring(7));
        setCurrentPhoto(avatarData);
      } catch (error) {
        console.warn("Invalid saved avatar format:", error);
        setCurrentPhoto({ uri: sourcePhotoURL });
      }
    } else {
      setCurrentPhoto({ uri: sourcePhotoURL });
    }
  }, [userData, user]);

  React.useEffect(() => {
    if (userData?.cvdType) {
      setColorblindnessType(userData.cvdType);
    } else if (user?.cvdType) {
      setColorblindnessType(user.cvdType);
    }
  }, [userData?.cvdType, user?.cvdType]);

  const handleGuestAction = (actionName: string) => {
    Alert.alert(
      `Sign up to ${actionName}`,
      "You need a permanent account to customize your profile.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Up", onPress: () => router.push("/auth/signup") },
      ],
    );
  };

  // --- Image Handling Logic ---

  const savePhotoURL = async (url: string) => {
    if (isGuest || !user?.uid) return;

    try {
      // 1. Update Firebase Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }

      // 2. Update Realtime DB
      const userRef = ref(db, `users/${user.uid}`);
      await updateDb(userRef, {
        photoURL: url,
        updatedAt: new Date().toISOString(),
      });

      // 3. Update local Context & AsyncStorage
      const newProfile = { ...(user as any), photoURL: url };
      // @ts-ignore
      setUser(newProfile);
      await AsyncStorage.setItem("@user", JSON.stringify(newProfile));
    } catch (error) {
      console.error("Error saving photo URL:", error);
      Alert.alert("Error", "Failed to update profile image on server.");
    }
  };

  const uploadImageAsync = async (uri: string): Promise<string | null> => {
    if (!user?.uid) return null;
    setUploading(true);

    try {
      // Why are we using XMLHttpRequest? See: https://github.com/expo/expo/issues/2402#issuecomment-443726662
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const fileRef = storageRef(
        storage,
        `users/${user.uid}/profile_${Date.now()}.jpg`,
      );
      await uploadBytes(fileRef, blob);

      // We're done with the blob, close and release it
      // blob.close(); // Not strictly needed in newer JS, but good practice

      return await getDownloadURL(fileRef);
    } catch (e) {
      console.error(e);
      Alert.alert("Upload Failed", "Could not upload image to cloud storage.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handlePickImage = async () => {
    if (isGuest) return handleGuestAction("change photo");
    setAvatarModalVisible(false);

    // Request permissions
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const status = permission.status as string;
    if (status !== "granted" && status !== "limited") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduce quality for faster upload
    });

    if (!result.canceled && result.assets[0].uri) {
      const localUri = result.assets[0].uri;
      setCurrentPhoto({ uri: localUri }); // Optimistic UI update

      const downloadUrl = await uploadImageAsync(localUri);
      if (downloadUrl) {
        await savePhotoURL(downloadUrl);
      } else {
        // Revert UI if upload failed
        setCurrentPhoto(userData?.photoURL ? { uri: userData.photoURL } : null);
      }
    }
  };

  const handleTakePhoto = async () => {
    if (isGuest) return handleGuestAction("change photo");
    setAvatarModalVisible(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      const localUri = result.assets[0].uri;
      setCurrentPhoto({ uri: localUri });

      const downloadUrl = await uploadImageAsync(localUri);
      if (downloadUrl) {
        await savePhotoURL(downloadUrl);
      } else {
        setCurrentPhoto(userData?.photoURL ? { uri: userData.photoURL } : null);
      }
    }
  };

  const handleSelectSystemAvatar = async (
    avatar: (typeof SYSTEM_AVATARS)[0],
  ) => {
    if (isGuest) return handleGuestAction("change avatar");
    setAvatarModalVisible(false);

    setCurrentPhoto(avatar); // Update UI

    // Store system avatar config as a special string in photoURL
    const avatarString = `system:${JSON.stringify(avatar)}`;
    await savePhotoURL(avatarString);
  };

  // --- End Image Handling ---

  const handleUsernameEdit = (): void => {
    if (isGuest) return handleGuestAction("change username");
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  const handleUsernameSave = async (): Promise<void> => {
    if (!tempUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    const fullName = tempUsername.trim();
    const parts = fullName.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    setUsername(fullName);
    setIsEditingUsername(false);

    if (!isGuest && user?.uid) {
      try {
        const updates: Record<string, unknown> = {
          firstName,
          lastName,
          updatedAt: new Date().toISOString(),
        };

        const userRef = ref(db, `users/${user.uid}`);
        await updateDb(userRef, updates);

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: fullName });
        }

        const newProfile = {
          ...(user as any),
          firstName,
          lastName,
          displayName: fullName,
          updatedAt: updates.updatedAt,
        };
        // @ts-ignore
        setUser(newProfile);
        await AsyncStorage.setItem("@user", JSON.stringify(newProfile));

        Alert.alert("Success", "Username updated successfully!");
      } catch (err) {
        console.error("Failed to update username:", err);
        Alert.alert("Error", "Failed to save changes.");
      }
    }
  };

  const handleUsernameCancel = (): void => {
    setTempUsername(username);
    setIsEditingUsername(false);
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const closePasswordModal = () => {
    if (updatingPassword) return;
    resetPasswordForm();
    setPasswordModalVisible(false);
  };

  const getPasswordErrorMessage = (error: unknown) => {
    const code = (error as { code?: string })?.code;

    switch (code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Your current password is incorrect.";
      case "auth/weak-password":
        return "Choose a stronger password with at least 8 characters.";
      case "auth/requires-recent-login":
        return "Please log out and log back in before changing your password.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Could not update your password. Please try again.";
    }
  };

  const handleChangePassword = async () => {
    const emailForAuth = auth.currentUser?.email || user?.email;

    if (!auth.currentUser || !emailForAuth) {
      Alert.alert("Error", "Please log in again before changing your password.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters.");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      Alert.alert(
        "Error",
        "New password must include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Error",
        "New password must be different from the current password.",
      );
      return;
    }

    setUpdatingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(
        emailForAuth,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      resetPasswordForm();
      setPasswordModalVisible(false);
      Alert.alert("Success", "Password updated successfully.");
    } catch (error) {
      console.error("Failed to update password:", error);
      Alert.alert("Error", getPasswordErrorMessage(error));
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogoutOrSignup = (): void => {
    if (isGuest) {
      router.push("/auth/login");
    } else {
      Alert.alert("Log Out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            router.replace("/auth/login");
          },
          style: "destructive",
        },
      ]);
    }
  };

  // Helper component to render the profile image/avatar
  const renderProfileImage = () => {
    if (uploading) {
      return <ActivityIndicator size="large" color={palette.taupe} />;
    }

    if (currentPhoto?.uri) {
      // Render Uploaded Image
      return (
        <Image
          source={{ uri: currentPhoto.uri }}
          style={styles.profileImageSrc}
        />
      );
    } else if (currentPhoto?.bgColor) {
      // Render System Avatar
      return (
        <View
          style={[
            styles.profileImage,
            {
              backgroundColor: currentPhoto.bgColor,
              borderColor: palette.charcoal,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={50 * scale}
            color={darkMode ? currentPhoto.deco : "rgba(255,255,255,0.7)"}
          />
          <View
            style={[
              styles.decoDot,
              { backgroundColor: currentPhoto.deco, top: 20, right: 20 },
            ]}
          />
          <View
            style={[
              styles.decoDot,
              { backgroundColor: palette.charcoal, bottom: 20, left: 20 },
            ]}
          />
        </View>
      );
    } else {
      // Default placeholder
      return (
        <View
          style={[
            styles.profileImage,
            { borderColor: palette.charcoal, backgroundColor: palette.white },
          ]}
        >
          <Ionicons name="person" size={50 * scale} color={palette.taupe} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Guest Banner */}
        {isGuest && (
          <View
            style={[styles.guestBanner, { backgroundColor: palette.taupe }]}
          >
            <Ionicons
              name="information-circle"
              size={24 * scale}
              color="#FFF"
            />
            <View style={styles.guestBannerContent}>
              <Text style={[styles.guestBannerTitle, { fontSize: 16 * scale }]}>
                Unsaved Profile
              </Text>
              <Text style={[styles.guestBannerText, { fontSize: 13 * scale }]}>
                Sign up to save changes permanently.
              </Text>
            </View>
          </View>
        )}

        {/* Profile Picture Section */}
        <View
          style={[styles.profileSection, { paddingTop: isGuest ? 10 : 40 }]}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.imageFrame}>{renderProfileImage()}</View>

            {/* EDIT ICON BADGE - NOW FUNCTIONAL */}
            <TouchableOpacity
              style={[
                styles.editIconBadge,
                { backgroundColor: palette.charcoal, borderColor: theme.bg },
              ]}
              onPress={() =>
                isGuest
                  ? handleGuestAction("upload photo")
                  : setAvatarModalVisible(true)
              }
              disabled={uploading}
            >
              <Ionicons name="camera" size={18 * scale} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.profileName,
              { color: theme.text, fontSize: 22 * scale },
            ]}
          >
            {username}
          </Text>
          <Text
            style={[
              styles.profileEmail,
              { color: theme.subText, fontSize: 14 * scale },
            ]}
          >
            {email}
          </Text>
        </View>

        {/* ACCOUNT DETAILS SECTION */}
        <Text
          style={[
            styles.sectionHeader,
            { color: theme.subText, fontSize: 13 * scale },
          ]}
        >
          ACCOUNT DETAILS
        </Text>

        {/* Username Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardIcon}>
            <Ionicons
              name="person-outline"
              size={20 * scale}
              color={theme.subText}
            />
          </View>
          <View style={styles.cardLeft}>
            <Text
              style={[
                styles.label,
                { fontSize: 12 * scale, color: theme.subText },
              ]}
            >
              USERNAME
            </Text>
            {isEditingUsername ? (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    fontSize: 16 * scale,
                    borderBottomColor: palette.taupe,
                  },
                ]}
                value={tempUsername}
                onChangeText={setTempUsername}
                autoFocus
                placeholder="Full Name"
              />
            ) : (
              <Text
                style={[
                  styles.value,
                  { color: theme.text, fontSize: 16 * scale },
                ]}
              >
                {username}
              </Text>
            )}
          </View>

          {isEditingUsername ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleUsernameCancel}>
                <Ionicons
                  name="close-circle"
                  size={28 * scale}
                  color={palette.error}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUsernameSave}>
                <Ionicons
                  name="checkmark-circle"
                  size={28 * scale}
                  color={palette.sage}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleUsernameEdit}>
              <Text
                style={[
                  styles.editText,
                  { color: palette.taupe, fontSize: 14 * scale },
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Email Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardIcon}>
            <Ionicons
              name="mail-outline"
              size={20 * scale}
              color={theme.subText}
            />
          </View>
          <View style={styles.cardLeft}>
            <Text
              style={[
                styles.label,
                { fontSize: 12 * scale, color: theme.subText },
              ]}
            >
              EMAIL
            </Text>
            <Text
              style={[
                styles.value,
                { color: theme.text, fontSize: 16 * scale },
              ]}
            >
              {email}
            </Text>
          </View>
        </View>

        {/* Phone Number Card */}
        {!isGuest && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardIcon}>
              <Ionicons
                name="call-outline"
                size={20 * scale}
                color={theme.subText}
              />
            </View>
            <View style={styles.cardLeft}>
              <Text
                style={[
                  styles.label,
                  { fontSize: 12 * scale, color: theme.subText },
                ]}
              >
                PHONE
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: theme.text, fontSize: 16 * scale },
                ]}
              >
                {phone}
              </Text>
            </View>
          </View>
        )}

        {/* Color Vision Type Card */}
        {!isGuest && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardIcon}>
              <Ionicons
                name="eye-outline"
                size={20 * scale}
                color={theme.subText}
              />
            </View>
            <View style={styles.cardLeft}>
              <Text
                style={[
                  styles.label,
                  { fontSize: 12 * scale, color: theme.subText },
                ]}
              >
                COLOR VISION TYPE
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: theme.text, fontSize: 16 * scale },
                ]}
              >
                {colorblindnessType}
              </Text>
            </View>
          </View>
        )}
        {/* Change Password */}
        {!isGuest && (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => setPasswordModalVisible(true)}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20 * scale}
                color={theme.subText}
              />
            </View>
            <View style={styles.cardLeft}>
              <Text
                style={[
                  styles.label,
                  { fontSize: 12 * scale, color: theme.subText },
                ]}
              >
                PASSWORD
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: theme.text, fontSize: 16 * scale },
                ]}
              >
                Change Password
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20 * scale}
              color={theme.subText}
            />
          </TouchableOpacity>
        )}
        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: palette.charcoal }]}
          onPress={handleLogoutOrSignup}
        >
          <Ionicons
            name={isGuest ? "log-in-outline" : "log-out-outline"}
            size={22 * scale}
            color="#FFF"
          />
          <Text style={[styles.logoutText, { fontSize: 16 * scale }]}>
            {isGuest ? "Sign Up / Log In" : "Log Out"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- AVATAR / IMAGE PICKER MODAL --- */}
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, fontSize: 18 * scale },
              ]}
            >
              Edit Profile Picture
            </Text>

            {/* Upload Options */}
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handleTakePhoto}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(141,163,153,0.1)" },
                  ]}
                >
                  <Ionicons
                    name="camera-outline"
                    size={24 * scale}
                    color={palette.sage}
                  />
                </View>
                <Text style={[styles.uploadOptionText, { color: theme.text }]}>
                  Take Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handlePickImage}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(170,149,123,0.1)" },
                  ]}
                >
                  <Ionicons
                    name="images-outline"
                    size={24 * scale}
                    color={palette.taupe}
                  />
                </View>
                <Text style={[styles.uploadOptionText, { color: theme.text }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* System Avatars */}
            <Text style={[styles.subHeader, { color: theme.subText }]}>
              Or choose an avatar
            </Text>
            <View style={styles.avatarGrid}>
              {SYSTEM_AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  onPress={() => handleSelectSystemAvatar(avatar)}
                >
                  <View
                    style={[
                      styles.avatarOption,
                      { backgroundColor: avatar.bgColor },
                    ]}
                  >
                    <View
                      style={[
                        styles.decoDot,
                        {
                          backgroundColor: avatar.deco,
                          top: 8,
                          right: 8,
                          width: 6,
                          height: 6,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.decoDot,
                        {
                          backgroundColor: palette.charcoal,
                          bottom: 8,
                          left: 8,
                          width: 6,
                          height: 6,
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.modalCancel,
                { backgroundColor: palette.charcoal },
              ]}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- CHANGE PASSWORD MODAL --- */}
      {!isGuest && (
        <Modal
          visible={passwordModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closePasswordModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[
              styles.centerModalOverlay,
              { backgroundColor: "rgba(0,0,0,0.6)" },
            ]}
          >
            <View
              style={[
                styles.passwordModalContent,
                { backgroundColor: theme.card },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.text, fontSize: 18 * scale },
                ]}
              >
                Change Password
              </Text>

              <TextInput
                placeholder="Current Password"
                placeholderTextColor={theme.subText}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                editable={!updatingPassword}
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: theme.bg,
                    color: theme.text,
                    fontSize: 16 * scale,
                  },
                ]}
              />
              <TextInput
                placeholder="New Password"
                placeholderTextColor={theme.subText}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!updatingPassword}
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: theme.bg,
                    color: theme.text,
                    fontSize: 16 * scale,
                  },
                ]}
              />
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor={theme.subText}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!updatingPassword}
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: theme.bg,
                    color: theme.text,
                    fontSize: 16 * scale,
                  },
                ]}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.bg }]}
                  onPress={closePasswordModal}
                  disabled={updatingPassword}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: theme.subText, fontSize: 15 * scale },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: palette.sage },
                  ]}
                  onPress={handleChangePassword}
                  disabled={updatingPassword}
                >
                  {updatingPassword ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text
                      style={[
                        styles.modalButtonText,
                        { color: "#FFF", fontSize: 15 * scale },
                      ]}
                    >
                      Update
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Guest Banner
  guestBanner: {
    flexDirection: "row",
    padding: 16,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    gap: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  guestBannerContent: {
    flex: 1,
  },
  guestBannerTitle: {
    fontWeight: "700",
    marginBottom: 2,
    color: "#FFF",
  },
  guestBannerText: {
    color: "rgba(255,255,255,0.9)",
  },

  // Profile Header
  profileSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  imageFrame: {
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  profileImageSrc: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#2F2F2F", // palette.charcoal
  },
  decoDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  profileName: {
    fontWeight: "800",
    marginBottom: 4,
  },
  profileEmail: {
    fontWeight: "400",
  },

  // Section Headers
  sectionHeader: {
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 24,
  },

  // Cards
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIcon: {
    marginRight: 16,
    width: 24,
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
  },
  label: {
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontWeight: "600",
  },
  input: {
    fontWeight: "600",
    borderBottomWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginTop: -4,
  },
  editText: {
    fontWeight: "600",
    paddingLeft: 10,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logoutText: {
    fontWeight: "600",
    color: "#FFF",
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Slide up from bottom
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    width: "100%",
  },
  modalTitle: {
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  uploadOptionBtn: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadOptionText: {
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
  subHeader: {
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 30,
  },
  avatarOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "relative",
  },
  modalCancel: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalCancelText: {
    fontWeight: "700",
    color: "#FFF",
    fontSize: 16,
  },
  centerModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  passwordModalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  passwordInput: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  modalButtonText: {
    fontWeight: "700",
  },
});

export default ProfileScreen;
