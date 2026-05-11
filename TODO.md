# BackButton Addition via Layout - Progress Tracker

## Plan Overview

Add BackButton to all screens using app/\_layout.tsx headerLeft, excluding settings, dashboard, user profile, auth. Cleanup redundants.

Status: ✅ Approved by user

## Steps (Will update as completed)

### 1. ✅ Create this TODO.md

### 2. Verify & Update app/\_layout.tsx

- Read current content.
- Add missing Stack.Screen for screens like result, enhancer, gameui if not listed.
- Ensure exclusions: headerShown: false for auth/splash/index/(main).

### 3. Identify screens with manual BackButton

- Use search_files for `<BackButton` or import BackButton.
- List: screens/ColorDetective.tsx, others.

### 4. Cleanup redundant BackButton

- edit_file to remove manual imports/usage in identified screens.
- Ensure layout header handles it.

### 5. Verify exclusions

- Confirm dashboard (app/(main)/dashboard.tsx), settings (screens/Settings.tsx?), userprofile (screens/UserProfile.tsx) have no back.

### 6. Test

- expo start
- Navigate screens, check back button presence.

### 7. Complete task

Current Progress: Step 1 done.
