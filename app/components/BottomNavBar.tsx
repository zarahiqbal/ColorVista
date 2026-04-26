import { usePathname, useRouter } from 'expo-router'; // <--- The secret sauce
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Import Theme Hook
import { useTheme } from '@/Context/ThemeContext';

const TOOLS_COLORS = {
  sage: '#8DA399',
};

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname(); // Gets the current URL (e.g., "/dashboard")
  
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // Dynamic Theme Colors
  const theme = {
    navBg: darkMode ? '#1C1C1E' : '#FFFFFF',
    borderColor: darkMode ? '#2C2C2E' : '#F0F0F0',
    subText: darkMode ? '#A1A1AA' : '#9E9E9E',
    activeText: TOOLS_COLORS.sage,
  };

  // Helper: Checks if the current route matches the button
  const isActive = (routeKey: string) => {
    return pathname.includes(routeKey);
  };

  const getIconColor = (routeKey: string) => 
    isActive(routeKey) ? TOOLS_COLORS.sage : theme.subText;

  const getTextStyle = (routeKey: string) => ({ 
      fontSize: 11 * scale, 
      color: isActive(routeKey) ? theme.activeText : theme.subText,
      fontWeight: (isActive(routeKey) ? '600' : '500') as '600' | '500',
      marginTop: 4,
      letterSpacing: 0.3,
  });

  // Navigation Handler
  const handleNav = (route: string) => {
    // replace() prevents the back button history from getting messy
    router.replace(route as any); 
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.navBg, borderTopColor: theme.borderColor }]}>
      
      {/* PROFILE TAB */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNav('/userprofile')}
      >
        <FontAwesome name="user" size={24 * scale} color={getIconColor('userprofile')} />
        <Text style={getTextStyle('userprofile')}>Profile</Text>

        {isActive('userprofile') && <View style={styles.activeNavDot} />}
      </TouchableOpacity>

      {/* HOME TAB (DASHBOARD) */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNav('/dashboard')}
      >
        <FontAwesome name="home" size={24 * scale} color={getIconColor('dashboard')} />
        <Text style={getTextStyle('dashboard')}>Home</Text>
        
        {/* Active Indicator Dot */}
        {isActive('dashboard') && <View style={styles.activeNavDot} />}
      </TouchableOpacity>
      
      {/* SETTINGS TAB */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNav('/settings')}
      >
        <Feather name="settings" size={24 * scale} color={getIconColor('settings')} />
        <Text style={getTextStyle('settings')}>Settings</Text>

        {isActive('settings') && <View style={styles.activeNavDot} />}

      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // Handle iPhone safe area
    paddingHorizontal: 32,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    position: 'relative',
  },
  activeNavDot: {
    position: 'absolute',
    top: -12, // Floats above the icon
    width: 40,
    height: 3,
    backgroundColor: TOOLS_COLORS.sage,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});