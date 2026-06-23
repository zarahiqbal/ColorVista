# ColorVista - Colorblindness Assistance App
## Firebase Integration Complete ✅

A comprehensive React Native Expo app for color blindness assistance with **full Firebase integration** for authentication and user data management.

---

## 🎯 Features

### Authentication
- ✅ Email/Password Sign-Up
- ✅ Email/Password Sign-In  
- ✅ Secure Sign-Out
- ✅ Guest Mode (Offline)
- ✅ Persistent Sessions (AsyncStorage + Firebase)

### User Data Management
- ✅ Real-Time User Profiles (Realtime Database)
- ✅ Automatic Profile Creation on Sign-Up
- ✅ User Data Display Across App
- ✅ Real-Time Data Synchronization
- ✅ Offline Support with Caching

### App Features
- 📱 Live Color Detection
- 📤 Media Upload & Analysis
- 🎮 Interactive Games
- 📚 Educational Quizzes
- 🎨 Color Simulation Tools
- 🌙 Dark/Light Theme Support

---

## 📋 Quick Start

### 1. Prerequisites
- Node.js 16+ 
- Android Studio (for Android development)
- Firebase Account

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Firebase (5 minutes)
See **`FIREBASE_QUICKSTART.md`** for step-by-step instructions:
- Create Firebase project
- Download `google-services.json`
- Update `Context/firebase.ts` config
- Enable Authentication & Realtime Database

### 4. Run the App
```bash
npm run start           # Start Expo
npm run android        # Build for Android
npm run ios           # Build for iOS (Mac only)
npm run web           # Run on web
```

---

## 📂 Project Structure

```
ColorVista/
├── Context/                          # State management
│   ├── firebase.ts                  # Firebase init
│   ├── AuthContext.tsx              # Auth provider
│   ├── useUserData.ts               # Real-time data hook
│   └── ThemeContext.tsx             # Theme provider
│
├── components/                       # Reusable components
│   ├── UserInfoDisplay.tsx          # User info display
│   ├── BottomNavBar.tsx             # Navigation
│   └── Result.tsx                   # Result display
│
├── app/                              # Expo Router screens
│   ├── auth/
│   │   ├── login/                   # Login screen
│   │   ├── signup/                  # Signup screen
│   │   └── forgot-password/         # Password recovery
│   ├── (main)/
│   │   ├── dashboard.tsx            # Main dashboard
│   │   ├── settings.tsx             # Settings
│   │   └── userprofile.tsx          # User profile
│   └── _layout.tsx                  # Navigation setup
│
├── screens/                          # Screen components
│   ├── Dashboard.tsx                # Dashboard UI
│   ├── UserProfile.tsx              # Profile display
│   ├── Quiz1.tsx                    # Quiz screen
│   ├── LiveScreen.tsx               # Live detection
│   └── ...
│
├── assets/                           # Images & resources
├── android/                          # Android native code
├── FIREBASE_QUICKSTART.md           # Quick setup guide
├── FIREBASE_SETUP_GUIDE.md          # Complete guide
├── FIREBASE_ARCHITECTURE.md         # Architecture docs
└── package.json                     # Dependencies
```

---

## 🔥 Firebase Integration

### What's Included
- ✅ Email/Password Authentication
- ✅ Realtime Database for user profiles
- ✅ Real-time data synchronization
- ✅ Offline support via AsyncStorage
- ✅ Guest mode support
- ✅ Secure session management

### How It Works

**Sign-Up:**
1. User enters name, email, password
2. Firebase creates auth account
3. User profile saved to Realtime Database
4. User automatically signed in
5. Redirected to dashboard

**Sign-In:**
1. User enters email/password
2. Firebase authenticates
3. Profile loaded from Realtime Database
4. Data cached locally for offline access
5. User sees their information throughout app

**Real-Time Sync:**
1. User data automatically synced when changed in Firebase
2. App updates instantly across all screens
3. Works in background without user intervention

---

## 📊 Database Structure

```
Realtime Database
└── users/
    └── {uid}/
        ├── uid: string
        ├── firstName: string
        ├── lastName: string
        ├── email: string
        ├── role: 'user' | 'admin' | 'guest'
        ├── isGuest: boolean
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 🎯 Using User Data in Components

### Access Current User
```typescript
import { useAuth } from '@/Context/AuthContext';

function MyComponent() {
  const { user, isLoading } = useAuth();
  
  return <Text>{user?.firstName}</Text>;
}
```

### Get Real-Time User Data
```typescript
import { useUserData } from '@/Context/useUserData';

function MyComponent() {
  const { userData, loading } = useUserData();
  
  return <Text>{userData?.email}</Text>;
}
```

### Display User Info Component
```typescript
import { UserInfoDisplay } from '@/components/UserInfoDisplay';

function MyComponent() {
  return (
    <UserInfoDisplay 
      size="large"
      showEmail={true}
      showRole={true}
    />
  );
}
```

### Check Guest Mode
```typescript
const { user } = useAuth();

if (user?.isGuest) {
  // Show limited features
} else {
  // Show full features
}
```

---

## 🔐 Security

### Authentication
- Firebase handles all password security
- No passwords stored in app
- Sessions managed by Firebase

### Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```
**Effect:** Users can only access their own data

### Local Storage
- Only public user data cached locally
- Platform-level encryption via AsyncStorage
- Cleared on sign-out

---

## 📱 Supported Platforms

- ✅ Android 8.0+
- ✅ iOS 12.0+  
- ✅ Web (Limited features)

---

## 🧪 Testing

### Test Sign-Up
```bash
npm run start
# Tap "Sign up here"
# Enter test credentials
# Check Firebase Console for user
```

### Test Sign-In
```bash
# Sign out from app
# Log back in with same credentials
# Should load user data
```

### Test Real-Time Sync
```bash
# Login to app
# Go to Firebase Console
# Edit user data
# Watch app update in real-time
```

---

## 📚 Documentation

- **[Firebase Quick Start](./FIREBASE_QUICKSTART.md)** - Get started in 5 minutes
- **[Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)** - Complete detailed instructions
- **[Firebase Architecture](./FIREBASE_ARCHITECTURE.md)** - Technical architecture & data flow

---

## 🛠️ Available Scripts

```bash
# Start Expo development server
npm run start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Reset project
npm run reset-project
```

---

## 📦 Key Dependencies

```json
{
  "firebase": "^12.6.0",
  "react-native": "0.81.5",
  "expo": "~54.0.25",
  "expo-router": "~6.0.15",
  "@react-native-async-storage/async-storage": "2.2.0",
  "react": "19.1.0"
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `cd android && ./gradlew clean && cd ..` |
| Firebase config error | Check `Context/firebase.ts` values |
| User data not showing | Verify Realtime Database is enabled |
| Sign-up fails | Check Authentication is enabled in Firebase |
| Module not found | Run `npm install firebase` |

See **[Troubleshooting Guide](./FIREBASE_SETUP_GUIDE.md#troubleshooting)** for more help.

---

## 🚀 Deployment

### Before Going to Production
1. ✅ Update Firebase security rules
2. ✅ Move API keys to environment variables
3. ✅ Enable email verification
4. ✅ Test on physical device
5. ✅ Review all error handling
6. ✅ Enable Firebase Analytics
7. ✅ Set up crash reporting

See **[Deployment Checklist](./FIREBASE_ARCHITECTURE.md#deployment-checklist)** for details.

---

## 🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

---

## 📞 Support

For issues with:
- **Firebase**: See `FIREBASE_SETUP_GUIDE.md`
- **React Native**: Check [React Native docs](https://reactnative.dev/)
- **Expo**: Visit [Expo docs](https://docs.expo.dev/)

---

## 👥 Contributors

- **Project**: ColorVista - Colorblindness Assistance App
- **Firebase Integration**: Complete with Auth + Realtime DB
- **Last Updated**: December 2025

---

## 📄 License

ISC

---

## 🎉 What's Next?

Consider adding:
- 🔐 Social login (Google, Apple)
- 📸 Profile picture upload
- 🎮 Enhanced game features
- 📊 User statistics & leaderboard
- 🔔 Push notifications
- 📈 Advanced analytics

See **[Future Enhancements](./FIREBASE_ARCHITECTURE.md#future-enhancements)** for details.

---

**Your ColorVista Firebase integration is ready to deploy!** 🚀

For detailed setup instructions, see [`FIREBASE_QUICKSTART.md`](./FIREBASE_QUICKSTART.md)
