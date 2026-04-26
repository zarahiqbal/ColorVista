
// import { Feather, Ionicons } from '@expo/vector-icons';
// import { Stack, useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   LayoutAnimation,
//   Linking,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   UIManager,
//   View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // 1. IMPORT THEME HOOK
// import { useTheme } from '../Context/ThemeContext';

// // Enable LayoutAnimation for Android
// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// // --- MOCK DATA ---
// const faqData = [
//   {
//     category: 'General',
//     items: [
//       { id: 1, q: "What is Color Vista?", a: "Color Vista is an app designed to help users identify colors using their camera, simulate different types of color blindness, and enhance images for better visibility." },
//       { id: 2, q: "Is the app free to use?", a: "Yes, the core features like Live Detection and basic Image Upload are free. Advanced features may require a subscription." },
//     ]
//   },
//   {
//     category: 'Accessibility',
//     items: [
//       { id: 3, q: "How do I change the color blind mode?", a: "Go to Settings > Color Blind Mode. You can choose between Protanopia, Deuteranopia, and Tritanopia." },
//       { id: 4, q: "Does the text size change everywhere?", a: "Yes! In Settings, you can adjust the Font Size (Small, Medium, Large), and it will apply across the entire application." },
//     ]
//   },
//   {
//     category: 'Account & Privacy',
//     items: [
//       { id: 5, q: "How do I reset my password?", a: "Go to Profile > Manage Profile. From there you can update your credentials or request a password reset via email." },
//       { id: 6, q: "Is my camera data saved?", a: "No. Live detection happens locally on your device. Images uploaded for processing are processed temporarily and not stored permanently on our servers." },
//     ]
//   }
// ];

// export default function HelpScreen() {
//   const router = useRouter();

//   // 2. CONSUME THEME CONTEXT
//   const { darkMode, getFontSizeMultiplier } = useTheme();
//   const scale = getFontSizeMultiplier();

//   // 3. DEFINE DYNAMIC COLORS BASED ON THE UPLOADED IMAGE
//   // Background: Warm Cream (#F4F1EA)
//   // Sage Green Accent: (#8E9F97) - taken from the bottom left card
//   // Tan Accent: (#A89078) - taken from the bottom right card
//   // Text: Dark Brownish Grey (#333333)
  
//   const theme = {
//     bg: darkMode ? '#121212' : '#F4F1EA', // The warm cream background from the image
//     card: darkMode ? '#1C1C1E' : '#FFFFFF',
//     text: darkMode ? '#FFFFFF' : '#333333', // Softer dark grey, not harsh black
//     subText: darkMode ? '#9CA3AF' : '#888888',
//     border: darkMode ? '#2C2C2E' : 'transparent', // The image shows clean cards without heavy borders
//     primary: '#8E9F97', // The Sage Green from the stats card
//     secondary: '#A89078', // The Tan Brown
//     inputBg: darkMode ? '#2C2C2E' : '#FFFFFF',
//     placeholder: darkMode ? '#6B7280' : '#A0A0A0',
//     searchIcon: darkMode ? '#9CA3AF' : '#8E9F97',
//     headerBg: darkMode ? '#121212' : '#F4F1EA', // Match main BG for seamless look
//   };

//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedId, setExpandedId] = useState<number | null>(null);

//   const toggleExpand = (id: number) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpandedId(expandedId === id ? null : id);
//   };

//   // Filter Logic
//   const filteredData = faqData.map(section => {
//     const filteredItems = section.items.filter(item => 
//       item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       item.a.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     return { ...section, items: filteredItems };
//   }).filter(section => section.items.length > 0);

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
//       <Stack.Screen options={{ headerShown: false }} />

//       {/* --- HEADER --- */}
//       {/* Removed border bottom to match the clean look of the reference */}
//       <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24 * scale} color={theme.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: theme.text, fontSize: 18 * scale }]}>Help & FAQs</Text>
//         <View style={{ width: 24 }} /> 
//       </View>

//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
        
//         {/* --- SEARCH BAR --- */}
//         <View style={styles.searchContainer}>
//           <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 22 * scale, marginBottom: 16 }]}>
//             How can we help?
//           </Text>
//           <View style={[styles.searchBar, { backgroundColor: theme.inputBg }]}>
//             <Ionicons name="search" size={20 * scale} color={theme.searchIcon} />
//             <TextInput 
//               style={[styles.searchInput, { color: theme.text, fontSize: 16 * scale }]}
//               placeholder="Search for answers..."
//               placeholderTextColor={theme.placeholder}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => setSearchQuery('')}>
//                 <Ionicons name="close-circle" size={18 * scale} color={theme.subText} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* --- FAQ LIST --- */}
//         <View style={styles.faqList}>
//           {filteredData.map((section, index) => (
//             <View key={index} style={styles.sectionContainer}>
//               <Text style={[styles.categoryTitle, { color: theme.subText, fontSize: 13 * scale }]}>
//                 {section.category.toUpperCase()}
//               </Text>
              
//               {section.items.map((item) => {
//                 const isExpanded = expandedId === item.id;
//                 return (
//                   <View 
//                     key={item.id} 
//                     style={[
//                       styles.faqItem, 
//                       { backgroundColor: theme.card, borderColor: theme.border }
//                     ]}
//                   >
//                     <TouchableOpacity 
//                       style={styles.questionRow} 
//                       onPress={() => toggleExpand(item.id)}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={[styles.questionText, { color: theme.text, fontSize: 16 * scale }]}>
//                         {item.q}
//                       </Text>
//                       {/* Using the Sage color for the active icon */}
//                       <Feather 
//                         name={isExpanded ? "minus" : "plus"} 
//                         size={20 * scale} 
//                         color={isExpanded ? theme.primary : theme.subText} 
//                       />
//                     </TouchableOpacity>
                    
//                     {isExpanded && (
//                       <View style={styles.answerContainer}>
//                         {/* Removed divider line to match the cleaner "card" look */}
//                         <Text style={[styles.answerText, { color: theme.subText, fontSize: 15 * scale }]}>
//                           {item.a}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 );
//               })}
//             </View>
//           ))}

//           {filteredData.length === 0 && (
//             <View style={styles.emptyState}>
//               <Feather name="help-circle" size={48 * scale} color={theme.subText} />
//               <Text style={[styles.emptyText, { color: theme.subText, fontSize: 16 * scale }]}>
//                 No results found for "{searchQuery}"
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* --- CONTACT SUPPORT --- */}
//         {/* Styled to look like the bottom stats cards in the reference image */}
//         <View style={styles.footerContainer}>
//            <Text style={[styles.categoryTitle, { color: theme.subText, fontSize: 13 * scale, marginBottom: 10 }]}>
//               SUPPORT
//            </Text>
//            <TouchableOpacity 
//               style={[styles.contactCard, { backgroundColor: theme.card }]}
//               onPress={() => {
//                 Linking.openURL('mailto:support@colorvista.com?subject=App Support Request');
//               }}
//             >
//               <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
//                 <Feather name="mail" size={22 * scale} color={theme.secondary} />
//               </View>
              
//               <View style={styles.contactContent}>
//                 <Text style={[styles.contactTitle, { color: theme.text, fontSize: 16 * scale }]}>
//                   Contact Support
//                 </Text>
//                 <Text style={[styles.contactSubtitle, { color: theme.subText, fontSize: 14 * scale }]}>
//                   Need more help? Send us an email.
//                 </Text>
//               </View>
              
//               <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
//             </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//     paddingVertical: 15,
//     // Removed borderBottomWidth to match the seamless header in the reference
//   },
//   backButton: {
//     padding: 4,
//     marginLeft: -4,
//   },
//   headerTitle: {
//     fontWeight: '600',
//     fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//   },
//   scrollContent: {
//     paddingBottom: 60,
//   },
//   searchContainer: {
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 20, // Increased radius to match the "soft" UI
//     paddingHorizontal: 16,
//     height: 54,
//     // Removed border, relying on background contrast (White vs Cream)
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     height: '100%',
//     fontWeight: '500',
//   },
//   faqList: {
//     paddingHorizontal: 24,
//   },
//   sectionContainer: {
//     marginBottom: 24,
//   },
//   categoryTitle: {
//     fontWeight: '600',
//     marginBottom: 12,
//     marginLeft: 4,
//     letterSpacing: 1.2,
//     opacity: 0.8,
//   },
//   faqItem: {
//     borderRadius: 20, // Matching the reference image card radius
//     marginBottom: 16,
//     overflow: 'hidden',
//     // Removed border width, added subtle shadow for "card" effect
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 6,
//     elevation: 1,
//   },
//   questionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//   },
//   questionText: {
//     flex: 1,
//     fontWeight: '600',
//     marginRight: 10,
//   },
//   answerContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     paddingTop: 0,
//   },
//   answerText: {
//     lineHeight: 22,
//     fontWeight: '400',
//   },
//   emptyState: {
//     alignItems: 'center',
//     marginTop: 40,
//     gap: 10,
//   },
//   emptyText: {
//     textAlign: 'center',
//   },
//   footerContainer: {
//     paddingHorizontal: 24,
//     marginTop: 10,
//   },
//   contactCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 24, // Matches the bottom stats cards
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.04,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   iconBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   contactContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   contactTitle: {
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   contactSubtitle: {
//     fontWeight: '400',
//   },
// });
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. IMPORT THEME HOOK
import { useTheme } from '../Context/ThemeContext';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- MOCK DATA ---
const faqData = [
  {
    category: 'General',
    items: [
      { id: 1, q: "What is Color Vista?", a: "Color Vista is an app designed to help users identify colors using their camera, simulate different types of color blindness, and enhance images for better visibility." },
      { id: 2, q: "Is the app free to use?", a: "Yes, the core features like Live Detection and basic Image Upload are free. Advanced features may require a subscription." },
    ]
  },
  {
    category: 'Accessibility',
    items: [
      { id: 3, q: "How do I change the color blind mode?", a: "Go to Settings > Color Blind Mode. You can choose between Protanopia, Deuteranopia, and Tritanopia." },
      { id: 4, q: "Does the text size change everywhere?", a: "Yes! In Settings, you can adjust the Font Size (Small, Medium, Large), and it will apply across the entire application." },
    ]
  },
  {
    category: 'Account & Privacy',
    items: [
      { id: 5, q: "How do I reset my password?", a: "Go to Profile > Manage Profile. From there you can update your credentials or request a password reset via email." },
      { id: 6, q: "Is my camera data saved?", a: "No. Live detection happens locally on your device. Images uploaded for processing are processed temporarily and not stored permanently on our servers." },
    ]
  }
];

export default function HelpScreen() {
  const router = useRouter();

  // 2. CONSUME THEME CONTEXT
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();

  // 3. THEME COLORS (Warm Earth Tones)
  const theme = {
    bg: darkMode ? '#121212' : '#F4F1EA', 
    card: darkMode ? '#1C1C1E' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#333333', 
    subText: darkMode ? '#9CA3AF' : '#888888',
    border: darkMode ? '#2C2C2E' : 'transparent', 
    primary: '#8E9F97', // Sage Green
    secondary: '#A89078', // Tan Brown
    inputBg: darkMode ? '#2C2C2E' : '#FFFFFF',
    placeholder: darkMode ? '#6B7280' : '#A0A0A0',
    searchIcon: darkMode ? '#9CA3AF' : '#8E9F97',
    headerBg: darkMode ? '#121212' : '#F4F1EA', 
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // --- ROBUST CONTACT HANDLER ---
  const handleContactSupport = async () => {
    const email = 'zarahiiqbal@gmail.com';
    const subject = 'App Support Request';
    const body = 'Hi Team,\n\nI need help with...';

    // Build the URL carefully with encoding
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      // Direct open attempt (Works best on Android 11+ and iOS)
      const supported = await Linking.openURL(url);
    } catch (err) {
      console.log('Mail open error:', err);
      // Fallback Alert
      Alert.alert(
        "Could not open Mail",
        `Please send an email manually to:\n${email}`,
        [
            { 
                text: "Copy Email", 
                onPress: () => {
                    // Ideally you would import Clipboard here, but for now just OK
                    // Clipboard.setString(email); 
                }
            },
            { text: "OK" }
        ]
      );
    }
  };

  // Filter Logic
  const filteredData = faqData.map(section => {
    const filteredItems = section.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- HEADER --- */}
      {/* <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24 * scale} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 18 * scale }]}>Help & FAQs</Text>
        <View style={{ width: 24 }} /> 
      </View> */}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- SEARCH BAR --- */}
        <View style={styles.searchContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 22 * scale, marginBottom: 16 }]}>
            How can we help?
          </Text>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBg }]}>
            <Ionicons name="search" size={20 * scale} color={theme.searchIcon} />
            <TextInput 
              style={[styles.searchInput, { color: theme.text, fontSize: 16 * scale }]}
              placeholder="Search for answers..."
              placeholderTextColor={theme.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18 * scale} color={theme.subText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- FAQ LIST --- */}
        <View style={styles.faqList}>
          {filteredData.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={[styles.categoryTitle, { color: theme.subText, fontSize: 13 * scale }]}>
                {section.category.toUpperCase()}
              </Text>
              
              {section.items.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <View 
                    key={item.id} 
                    style={[
                      styles.faqItem, 
                      { backgroundColor: theme.card, borderColor: theme.border }
                    ]}
                  >
                    <TouchableOpacity 
                      style={styles.questionRow} 
                      onPress={() => toggleExpand(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.questionText, { color: theme.text, fontSize: 16 * scale }]}>
                        {item.q}
                      </Text>
                      <Feather 
                        name={isExpanded ? "minus" : "plus"} 
                        size={20 * scale} 
                        color={isExpanded ? theme.primary : theme.subText} 
                      />
                    </TouchableOpacity>
                    
                    {isExpanded && (
                      <View style={styles.answerContainer}>
                        <Text style={[styles.answerText, { color: theme.subText, fontSize: 15 * scale }]}>
                          {item.a}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          {filteredData.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="help-circle" size={48 * scale} color={theme.subText} />
              <Text style={[styles.emptyText, { color: theme.subText, fontSize: 16 * scale }]}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* --- CONTACT SUPPORT --- */}
        <View style={styles.footerContainer}>
           <Text style={[styles.categoryTitle, { color: theme.subText, fontSize: 13 * scale, marginBottom: 10 }]}>
              SUPPORT
           </Text>
           <TouchableOpacity 
              style={[styles.contactCard, { backgroundColor: theme.card }]}
              onPress={handleContactSupport}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
                <Feather name="mail" size={22 * scale} color={theme.secondary} />
              </View>
              
              <View style={styles.contactContent}>
                <Text style={[styles.contactTitle, { color: theme.text, fontSize: 16 * scale }]}>
                  Contact Support
                </Text>
                <Text style={[styles.contactSubtitle, { color: theme.subText, fontSize: 14 * scale }]}>
                  Need more help? Send us an email.
                </Text>
              </View>
              
              <Feather name="chevron-right" size={20 * scale} color={theme.subText} />
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    height: '100%',
    fontWeight: '500',
  },
  faqList: {
    paddingHorizontal: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 1.2,
    opacity: 0.8,
  },
  faqItem: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    flex: 1,
    fontWeight: '600',
    marginRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 0,
  },
  answerText: {
    lineHeight: 22,
    fontWeight: '400',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
    justifyContent: 'center',
  },
  contactTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontWeight: '400',
  },
});