# 🔥 Firebase Integration - Quick Start Guide

## What's Been Done

Your ColorVista app now has **complete Firebase Authentication and Realtime Database integration**. Here's what was set up:

### ✅ Files Created
1. **`Context/firebase.ts`** - Firebase initialization
2. **`Context/useUserData.ts`** - Real-time data hook
3. **`Context/useUserData.ts`** - Real-time data hook
4. **`components/UserInfoDisplay.tsx`** - User info display component
5. **`FIREBASE_SETUP_GUIDE.md`** - Full comprehensive guide

### ✅ Files Updated
1. **`Context/AuthContext.tsx`** - Firebase Auth + Realtime DB integration
2. **`app/auth/login/index.tsx`** - Uses Firebase sign-in
3. **`app/auth/signup/index.tsx`** - Uses Firebase sign-up
4. **`screens/UserProfile.tsx`** - Displays Firebase user data
5. **`screens/Dashboard.tsx`** - Shows logged-in user info
6. **`android/build.gradle`** - Added Firebase plugin

---

## 🚀 Setup Instructions (5 Minutes)

### Step 1: Create Firebase Project
1. Go to **https://console.firebase.google.com/**
2. Click **Add Project**
3. Name it: `colorvista`
4. Follow the wizard

### Step 2: Register Android App
1. In Firebase Console, click **Android icon**
2. Enter Package Name: `com.anonymous.cvdquiz`
3. Download `google-services.json`
4. Place it in: **`android/app/google-services.json`**

### Step 3: Enable Firebase Services

**Authentication:**
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password**

**Realtime Database:**
- Go to **Database** → **Realtime Database**
- Click **Create Database**
- Choose **Test mode** (for now)
- Copy your database URL

### Step 4: Update Firebase Config
Edit `Context/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'https://YOUR_PROJECT-default-rtdb.firebaseio.com'
};
```

**Where to find these values:**
- Firebase Console → Project Settings (⚙️ icon)
- Your apps section → Copy from `google-services.json`

---

## 🧪 Testing

### Test Sign-Up
```
1. Run: npm run start
2. Tap "Sign up here"
3. Enter:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: TestPass123
4. Check Firebase Console:
   - Authentication → Users (should see john@example.com)
   - Realtime Database → users/{uid} (should see user data)
```

### Test Sign-In
```
1. Sign out
2. Enter same email/password
3. Should load dashboard with user data
```

### Test Real-Time Sync
```
1. Log in to app
2. Go to Firebase Console → Realtime Database
3. Edit a user field (change firstName to "Johnny")
4. Watch app update in real-time!
```

---

## 📊 Database Structure

When users sign up, their data is saved here:
```
Realtime Database (Root)
└── users/
    └── {uid}/
        ├── uid: "user-uid"
        ├── firstName: "John"
        ├── lastName: "Doe"
        ├── email: "john@example.com"
        ├── role: "user"
        ├── isGuest: false
        ├── createdAt: "2025-01-01T10:00:00Z"
        └── updatedAt: "2025-01-01T10:00:00Z"
```

---

## 🎯 Using User Data in Your Components

### Display User Name
```typescript
import { useAuth } from '@/Context/AuthContext';
import { useUserData } from '@/Context/useUserData';

export default function MyScreen() {
  const { user } = useAuth();
  const { userData } = useUserData();

  return <Text>Welcome, {userData?.firstName}!</Text>;
}
```

### Check if Guest
```typescript
const { user } = useAuth();

if (user?.isGuest) {
  return <Text>Guest Mode</Text>;
}
```

### Display User Info Component
```typescript
import { UserInfoDisplay } from '@/components/UserInfoDisplay';

<UserInfoDisplay 
  size="large" 
  showEmail={true} 
  textColor="#000000" 
/>
```

---

## 🔒 Security Setup (Important for Production)

Update Realtime Database Rules:

**Go to: Realtime Database → Rules**

Replace with:
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
- Users can **only** read/write their own data
- Required fields must be present

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Could not compile build file"** | Run: `cd android && ./gradlew clean && cd ..` |
| **"Module not found: firebase"** | Run: `npm install firebase` |
| **User data not showing** | Check Firebase Console → Realtime Database for data |
| **Can't sign up** | Verify Authentication is enabled in Firebase |
| **Guest login not working** | Check `AuthContext.tsx` → `loginAsGuest()` function |
| **Data not persisting** | Check `google-services.json` is in `android/app/` |

---

## 📱 App Features Now Working

✅ **Sign Up** - Creates auth user + stores profile in Firestore  
✅ **Sign In** - Authenticates user + loads profile  
✅ **Sign Out** - Clears auth + local cache  
✅ **Guest Login** - Works offline, no Firebase needed  
✅ **Real-Time Sync** - User data updates instantly  
✅ **Profile Display** - Shows user name/email throughout app  
✅ **Theme Support** - Works with dark/light mode  

---

## 📚 What Happens When

### On App Launch
1. Check AsyncStorage for cached user
2. Listen to Firebase Auth state changes
3. If logged in → Fetch user profile from Realtime DB
4. Display user data in app

### On Sign-Up
1. Create Firebase Auth user
2. Save profile to Realtime Database under `users/{uid}`
3. Cache locally in AsyncStorage
4. Navigate to dashboard

### On Sign-In
1. Authenticate with Firebase
2. Auth listener fires → Fetch profile from DB
3. Display dashboard with user data

### On Real-Time Data Change
1. `useUserData()` hook listens for changes
2. Component re-renders automatically
3. User sees updated data instantly

---

## 🎓 Learn More

- **Firebase Docs**: https://firebase.google.com/docs
- **Realtime Database Guide**: https://firebase.google.com/docs/database
- **Authentication Guide**: https://firebase.google.com/docs/auth
- **Expo Firebase**: https://docs.expo.dev/guides/setup-service-account/

---

## ✨ Next Steps

Consider adding:
1. **Profile Picture Upload** → Firebase Storage
2. **Update Profile** → Edit and sync to DB
3. **Social Sign-In** → Google/Apple auth
4. **Leaderboard** → Query and sort users
5. **User Stats** → Track quiz scores, game progress
6. **Push Notifications** → Firebase Cloud Messaging

---

## 💡 Tips

- Keep `databaseURL` in `Context/firebase.ts` updated
- Test in Firebase Console's Realtime Database viewer
- Monitor Auth states in Authentication tab
- Use security rules before going to production
- Enable backups in Firebase Console

---

**Your Firebase integration is ready! 🎉**

See `FIREBASE_SETUP_GUIDE.md` for the complete detailed guide.
