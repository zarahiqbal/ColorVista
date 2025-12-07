import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

  // 3. DEFINE DYNAMIC COLORS
  const theme = {
    bg: darkMode ? '#000000' : '#F9FAFB',
    card: darkMode ? '#1C1C1E' : '#FFFFFF',
    text: darkMode ? '#FFFFFF' : '#111827',
    subText: darkMode ? '#9CA3AF' : '#6B7280',
    border: darkMode ? '#2C2C2E' : '#E5E7EB',
    primary: '#14B8A6', // Teal
    inputBg: darkMode ? '#2C2C2E' : '#FFFFFF',
    placeholder: darkMode ? '#6B7280' : '#9CA3AF',
    searchIcon: darkMode ? '#9CA3AF' : '#6B7280',
    headerBg: darkMode ? '#000000' : '#FFFFFF',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@colorvista.com?subject=App Support Request');
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
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24 * scale} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: 18 * scale }]}>Help & FAQs</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- SEARCH BAR --- */}
        <View style={styles.searchContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 22 * scale, marginBottom: 16 }]}>
            How can we help you?
          </Text>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
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
              <Text style={[styles.categoryTitle, { color: theme.primary, fontSize: 14 * scale }]}>
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
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
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
        <View style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
            <Feather name="mail" size={24 * scale} color={theme.primary} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={[styles.contactTitle, { color: theme.text, fontSize: 16 * scale }]}>
              Still have questions?
            </Text>
            <Text style={[styles.contactSubtitle, { color: theme.subText, fontSize: 14 * scale }]}>
              Can't find the answer you're looking for? Please chat to our friendly team.
            </Text>
          </View>
          {/* <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: theme.primary }]}
            onPress={handleContactSupport}
          >
            <Text style={[styles.contactButtonText, { fontSize: 14 * scale }]}>Get in touch</Text>
          </TouchableOpacity> */}
          <TouchableOpacity 
  style={styles.row}
  onPress={() => {
    // This tells the phone to open the default mail app
    Linking.openURL('mailto:support@colorvista.com?subject=App Support Request');
  }}
>
  <View style={styles.rowLabel}>
    {/* Your icon and text here */}
    <Text style={styles.rowText}>Contact Support</Text>
  </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    padding: 24,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: '100%',
  },
  faqList: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginTop: 24,
  },
  categoryTitle: {
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 1,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontWeight: '500',
    marginRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 12,
    opacity: 0.5,
  },
  answerText: {
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
  contactCard: {
    margin: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  
  
row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes content to edges (Text left, Chevron right)
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Or your theme background
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // Subtle separator line
  },
  
  // The container for the Icon + Text on the left side
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // The actual text style
  rowText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12, // Space between the left icon and the text
    fontWeight: '500',
  },
});
