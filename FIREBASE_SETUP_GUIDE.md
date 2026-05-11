# Firebase Authentication & Realtime Database Integration Guide

## Overview
This guide explains how Firebase Authentication and Realtime Database have been integrated into your ColorVista app for user sign-up, sign-in, and real-time user data storage and retrieval.

---

## 1. Files Created/Modified

### New Files Created:
- **`Context/firebase.ts`** - Firebase app initialization and configuration
- **`Context/useUserData.ts`** - Custom hook for real-time user data fetching
- **`components/UserInfoDisplay.tsx`** - Reusable component to display user information

### Files Modified:
- **`Context/AuthContext.tsx`** - Updated to use Firebase Auth and Realtime Database
- **`app/auth/login/index.tsx`** - Updated to call Firebase sign-in
- **`app/auth/signup/index.tsx`** - Updated to call Firebase sign-up and save user to DB
- **`screens/UserProfile.tsx`** - Updated to display Firebase user data
- **`android/build.gradle`** - Added Firebase plugin for Android

---

## 2. Firebase Setup (One-Time Configuration)

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the wizard
3. Enable Google Analytics (optional)
4. Once created, select your project

### Step 2: Register Your App
1. In Firebase Console, click the **Android icon** to add an Android app
2. Enter Package Name: `com.anonymous.cvdquiz`
3. Download the `google-services.json` file
4. Place it in: `android/app/google-services.json`

### Step 3: Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable **Google** and **Apple** providers

### Step 4: Setup Realtime Database
1. Go to **Database** → **Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Choose location (e.g., us-central1)
5. Once created, note the database URL (format: `https://PROJECT_ID-default-rtdb.firebaseio.com`)

### Step 5: Update Firebase Config
Edit `Context/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com'
};
```

**How to find these values:**
- Go to Firebase Console → Project Settings (gear icon) → General
- Scroll down to "Your apps" section and click on your Android app
- Copy the config values from the "google-services.json" section

---

## 3. How It Works

### Authentication Flow

#### Sign-Up
1. User enters: `firstName`, `lastName`, `email`, `password`
2. `AuthContext.signUp()` is called
3. Firebase creates an auth user with email/password
4. User profile is created in Realtime Database under `users/{uid}`
5. User data is also saved to local AsyncStorage (for offline support)
6. User is automatically logged in and redirected to dashboard

#### Sign-In
1. User enters: `email`, `password`
2. `AuthContext.signIn()` is called
3. Firebase authenticates the user
4. `onAuthStateChanged` listener fetches the user profile from Realtime Database
5. Profile is cached in AsyncStorage
6. User is redirected to dashboard

#### Sign-Out
1. User clicks "Log Out" button
2. `AuthContext.logout()` is called
3. Firebase signs out the user
4. Local user data is cleared from AsyncStorage
5. User is redirected to login screen

### Real-Time Data Sync

The `useUserData()` hook provides real-time user data:
```typescript
const { userData, loading } = useUserData();

// userData contains:
// {
//   uid: 'user-id',
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john@example.com',
//   role: 'user',
//   isGuest: false,
//   createdAt: '2025-01-01T...',
//   updatedAt: '2025-01-01T...'
// }
```

---

## 4. Using User Data in Components

### Display User Name in Dashboard
```typescript
import { UserInfoDisplay } from '@/components/UserInfoDisplay';

export default function Dashboard() {
  return (
    <View>
      <UserInfoDisplay 
        size="large"
        showEmail={true}
        showRole={true}
        textColor="#000000"
      />
    </View>
  );
}
```

### Access User Data in Any Component
```typescript
import { useAuth } from '@/Context/AuthContext';
import { useUserData } from '@/Context/useUserData';

export default function MyComponent() {
  const { user, isLoading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();

  if (authLoading || userDataLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text>Welcome, {userData?.firstName}!</Text>
  );
}
```

### Check if User is Guest
```typescript
import { useAuth } from '@/Context/AuthContext';

export default function MyComponent() {
  const { user } = useAuth();

  if (user?.isGuest) {
    return <Text>Guest Mode - Some features locked</Text>;
  }

  return <Text>Logged In - Full Access</Text>;
}
```

---

## 5. Realtime Database Structure

Your Realtime Database will have this structure:
```
colorvista-8d249 (root)
└── users
    ├── user-id-1
    │   ├── uid: "user-id-1"
    │   ├── firstName: "John"
    │   ├── lastName: "Doe"
    │   ├── email: "john@example.com"
    │   ├── role: "user"
    │   ├── isGuest: false
    │   ├── createdAt: "2025-01-01T10:00:00Z"
    │   └── updatedAt: "2025-01-01T10:00:00Z"
    │
    └── user-id-2
        ├── uid: "user-id-2"
        ├── firstName: "Jane"
        ├── lastName: "Smith"
        ├── email: "jane@example.com"
        ├── role: "user"
        ├── isGuest: false
        ├── createdAt: "2025-01-01T11:00:00Z"
        └── updatedAt: "2025-01-01T11:00:00Z"
```

---

## 6. Security Rules for Production

When ready for production, update your Realtime Database rules:

**Go to Database → Rules and replace with:**
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid",
        ".validate": "newData.hasChildren(['uid', 'firstName', 'lastName', 'email', 'role', 'isGuest', 'createdAt'])"
      }
    }
  }
}
```

This ensures:
- Users can only read/write their own data
- Required fields must be present

---

## 7. Testing the Integration

### Test Sign-Up
1. Run: `npm run start` (or `npm run android`)
2. Tap "Sign up here" on login screen
3. Enter test details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: TestPass123
4. Verify in Firebase Console → Authentication → Users list
5. Verify in Firebase Console → Realtime Database → Check `users` node

### Test Sign-In
1. Log out (or restart app)
2. Enter same email/password
3. Should go to dashboard with user data loaded

### Test Real-Time Sync
1. Log in to the app
2. Go to Firebase Console → Realtime Database → `users/{uid}`
3. Edit a field (e.g., change `firstName` to "Johnny")
4. Watch app re-render with updated data in real-time

---

## 8. Troubleshooting

### "Could not compile build file"
- Make sure `android/build.gradle` has the `plugins {}` block at the top
- Run: `cd android && ./gradlew clean && cd ..`

### "Module not found: firebase"
- Run: `npm install firebase react-native-firebase-hooks`
- If using Expo: `expo install firebase`

### User data not showing
- Check Firebase Console → Realtime Database to see if data was saved
- Check browser DevTools → Network to see if API calls are failing
- Verify `databaseURL` in `Context/firebase.ts` is correct

### Offline data not persisting
- Make sure AsyncStorage is working: `npm install @react-native-async-storage/async-storage`
- User data is cached locally even if offline

### Guest login not working
- Check `AuthContext.tsx` → `loginAsGuest()` function
- Ensure you're calling `loginAsGuest()` on "Continue as Guest" button

---

## 9. Next Steps / Enhancements

Consider implementing:
1. **Social Sign-In** - Google/Apple authentication
2. **Profile Picture Upload** - Firebase Storage
3. **Update User Profile** - Allow editing and sync to DB
4. **User Preferences** - Store theme, language preferences in DB
5. **Leaderboard** - Query and display top users
6. **Activity Log** - Track user actions
7. **Push Notifications** - Firebase Cloud Messaging
8. **Analytics** - Firebase Analytics for user behavior tracking

---

## 10. Quick Reference

| File | Purpose |
|------|---------|
| `Context/firebase.ts` | Initialize Firebase app, export auth & db |
| `Context/AuthContext.tsx` | Manage auth state, provide signUp/signIn/logout |
| `Context/useUserData.ts` | Real-time hook for user data |
| `components/UserInfoDisplay.tsx` | Display user info component |
| `app/auth/login/index.tsx` | Login screen (uses signIn) |
| `app/auth/signup/index.tsx` | Signup screen (uses signUp) |
| `screens/UserProfile.tsx` | Profile screen (displays userData) |

---

## 11. Environment Variables (Optional)

For added security, you can move Firebase config to env variables:

1. Create `.env.local`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

2. Update `Context/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
```

---

## 12. Support & Documentation

- **Firebase Documentation**: https://firebase.google.com/docs
- **React Native Firebase**: https://react-native-firebase.io/
- **Expo Guide**: https://docs.expo.dev/
- **Firebase Realtime Database Guide**: https://firebase.google.com/docs/database

---

Generated: December 2025
ColorVista - Your Colorblindness Assistance App
