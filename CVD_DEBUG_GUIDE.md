# CVD Type Firebase Update - Debugging Guide

## Changes Made to Fix the Issue

### 1. **result.tsx** - Fixed useEffect trigger
**Problem:** useEffect was only watching `[user]`, but useEffect runs when component mounts before user is fully authenticated.

**Solution:** 
- Added `results` to dependency array `[user, results]`
- Added comprehensive logging at each step
- Now only saves if both user AND results are available
- Checks for `user.uid` specifically

### 2. **cvdService.ts** - Enhanced with logging & validation
**Added:**
- Validation for empty cvdType
- Detailed logging at each step (Firebase update, AsyncStorage update)
- Console markers (✅, ❌, 📝) for easy tracking
- Step-by-step debugging information

### 3. **useUserData.ts** - Added real-time listener logging
**Added:**
- Logging when listener is set up
- Logging when data is received from Firebase (📡)
- Logging when listener is cleaned up
- Clear indicators of what's happening at each stage

### 4. **UserProfile.tsx** - Better state sync logging
**Added:**
- Logging when userData changes
- Logging when cvdType state updates
- Logging when profile screen comes into focus
- Better tracking of state changes

## How to Debug

### Step 1: Check Firebase Console
1. Open Firebase Console → Realtime Database
2. Navigate to `users/{your-uid}`
3. Watch for `cvdType` field to appear/update in real-time

### Step 2: Check Console Logs (In Expo)
When you complete a quiz, open your Expo console and look for these logs in order:

```
✅ "Attempting to save CVD type. User: [UID], isGuest: false"
✅ "Diagnosis determined: [CVD Type]"
✅ "Saving CVD type for user: [UID]"
✅ "📝 Updating CVD type in Firebase for user: [UID]"
✅ "Update data: {cvdType: '...', updatedAt: '...'}"
✅ "Firebase update completed"
✅ "📱 Updating local storage. Previous cvdType: Normal Vision"
✅ "✅ CVD type updated successfully: [CVD Type]"
```

### Step 3: Check UserProfile Update
After the quiz:
1. Navigate to User Profile
2. Check console for:
```
"📡 useUserData received update: {..., cvdType: '[NEW TYPE]'}"
"📊 CVD Type changed from useUserData: [NEW TYPE]"
```

## Common Issues & Solutions

### Issue 1: Firebase Update Not Showing
**Logs show:** ❌ Error updating CVD type
**Solutions:**
- Check that `user.uid` is valid (not undefined)
- Check Firebase security rules allow writes to `users/{uid}`
- Check network connectivity
- Verify Firebase is initialized correctly in `firebase.ts`

### Issue 2: Profile Not Updating
**Logs show:** Firebase update successful, but UserProfile doesn't update
**Solutions:**
- Check that `useUserData()` is receiving updates (look for 📡 logs)
- Verify the real-time listener is attached (check `onValue` setup)
- Force reload the profile screen
- Check if `userData?.cvdType` is being received

### Issue 3: useEffect Not Running
**No logs at all when completing quiz**
**Solutions:**
- Verify you're logged in (not a guest)
- Verify `results` parameter is being passed correctly
- Check if `user` object has `uid` field
- Restart the app

## Expected Flow

```
Quiz Complete
    ↓
Navigate to Result Screen
    ↓
useEffect([user, results]) triggers
    ↓
getDiagnosis() → CVD Type determined
    ↓
updateUserCVDType() called
    ↓
Firebase update (console: 📝, ✅)
    ↓
AsyncStorage update (console: 📱, ✅)
    ↓
(1-2 seconds delay)
    ↓
Firebase real-time listener triggers in UserProfile
    ↓
useUserData receives update (console: 📡)
    ↓
UserProfile state updates (console: 📊)
    ↓
UI refreshes with new CVD Type
```

## Manual Testing Checklist

- [ ] Log in as authenticated user
- [ ] Complete a quiz
- [ ] Check Expo console for all ✅ logs
- [ ] Check Firebase Console - cvdType should update
- [ ] Go to User Profile - CVD Type should display
- [ ] Log out and log back in - CVD Type should persist
- [ ] Complete another quiz with different results
- [ ] CVD Type should update to match new results

## Additional Debug Commands

If stuck, you can add this to result.tsx temporarily:
```typescript
// Add after getDiagnosis()
useEffect(() => {
  console.log('=== DEBUG INFO ===');
  console.log('User:', user);
  console.log('Results:', results);
  console.log('Diagnosis:', getDiagnosis());
  console.log('================');
}, [user, results]);
```

## Quick Recovery

If CVD Type is still not updating:
1. Clear app cache: Expo → Clear all data
2. Re-authenticate (log out, log back in)
3. Complete quiz again
4. Check console logs and Firebase in parallel
5. Share the console error message for further debugging
