import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useTheme } from '@/Context/ThemeContext'; // Adjust path as needed

const { width } = Dimensions.get('window');

// --- MOCK DATA ---
const CATEGORIES = ['All', 'Art', 'UI Design', 'Nature', 'Fashion'];

const PALETTES = [
  { 
    name: 'High Contrast', 
    colors: ['#2F2F2F', '#F6F3EE', '#AA957B', '#8DA399'],
    desc: 'Safe for all types'
  },
  { 
    name: 'Sunset Safe', 
    colors: ['#2D3142', '#4F5D75', '#BFC0C0', '#FFFFFF'],
    desc: 'Deuteranopia friendly'
  },
  { 
    name: 'Ocean Depths', 
    colors: ['#003049', '#D62828', '#F77F00', '#FCBF49'],
    desc: 'Tritanopia focus'
  },
];

// EXPANDED DATASET FOR ALL CATEGORIES
const INSPIRATION_FEED = [
  // --- ARCHITECTURE / ART ---
  {
    id: 1,
    title: 'Texture over Hue',
    author: 'Alex D.',
    image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800&auto=format&fit=crop', 
    tag: 'Art',
    likes: 124,
  },
  {
    id: 3,
    title: 'Abstract Geometric',
    author: 'Mike R.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', 
    tag: 'Art',
    likes: 256,
  },
  {
    id: 10,
    title: 'Sculptural Forms',
    author: 'Elena V.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop',
    tag: 'Art',
    likes: 98,
  },

  // --- NATURE ---
  {
    id: 2,
    title: 'Monochrome Depth',
    author: 'Sarah J.',
    image: 'https://images.unsplash.com/photo-1485627658391-1365e4e0dbfe?q=80&w=800&auto=format&fit=crop', 
    tag: 'Nature',
    likes: 89,
  },
  {
    id: 4,
    title: 'Forest Patterns',
    author: 'Tom H.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    tag: 'Nature',
    likes: 312,
  },
  {
    id: 5,
    title: 'Desert Contrast',
    author: 'Lena K.',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop',
    tag: 'Nature',
    likes: 150,
  },

  // --- UI DESIGN ---
  {
    id: 6,
    title: 'Accessible Dashboards',
    author: 'DevStudio',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    tag: 'UI Design',
    likes: 420,
  },
  {
    id: 7,
    title: 'High Contrast Mobile',
    author: 'UxJane',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    tag: 'UI Design',
    likes: 275,
  },

  // --- FASHION ---
  {
    id: 8,
    title: 'Pattern Mixing',
    author: 'VogueStyles',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    tag: 'Fashion',
    likes: 180,
  },
  {
    id: 9,
    title: 'Neutral Tones',
    author: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    tag: 'Fashion',
    likes: 340,
  },
];

export default function GetInspiredScreen() {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();
  const [activeCategory, setActiveCategory] = useState('All');

  // --- FILTER LOGIC ---
  const filteredFeed = activeCategory === 'All' 
    ? INSPIRATION_FEED 
    : INSPIRATION_FEED.filter(item => item.tag === activeCategory);

  // --- EARTH TONE PALETTE ---
  const palette = {
    beigeBg: '#F6F3EE',
    charcoal: '#2F2F2F',
    sage: '#8DA399',
    taupe: '#AA957B',
    white: '#FFFFFF',
    textLight: '#6B6661',
    surfaceDark: '#1C1C1E',
  };

  const theme = {
    bg: darkMode ? palette.surfaceDark : palette.beigeBg,
    card: darkMode ? '#2C2C2E' : palette.white,
    text: darkMode ? '#F6F3EE' : palette.charcoal,
    subText: darkMode ? '#A1A1AA' : palette.textLight,
    accent: palette.sage,
    border: palette.taupe,
  };

  const dText = (size: number) => ({
    fontSize: size * scale,
    color: theme.text
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text, fontSize: 28 * scale }]}>
            Get Inspired
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.subText, fontSize: 14 * scale }]}>
            Curated accessibility & design
          </Text>
        </View>
        
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- CATEGORY PILLS --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.filterPill,
                { 
                  backgroundColor: activeCategory === cat ? palette.charcoal : theme.card,
                  borderColor: activeCategory === cat ? palette.charcoal : 'transparent'
                }
              ]}
            >
              <Text style={[
                styles.filterText, 
                { 
                  color: activeCategory === cat ? '#FFF' : theme.text,
                  fontSize: 14 * scale
                }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- FEATURED CARD (HARD MODE STYLE) --- */}
        {activeCategory === 'All' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dText(18)]}>Featured Palette</Text>
            <View style={[styles.featuredCard, { backgroundColor: palette.taupe }]}>
               <View style={styles.featuredContent}>
                  <View style={[styles.tagBadge, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                     <Text style={{color: '#FFF', fontWeight: '700', fontSize: 12 * scale}}>COLORBLIND SAFE</Text>
                  </View>
                  <Text style={[styles.featuredTitle, { fontSize: 22 * scale }]}>
                     The "Earth" Collection
                  </Text>
                  <Text style={[styles.featuredDesc, { fontSize: 14 * scale }]}>
                     High contrast ratios tested for Protanopia and Deuteranopia visibility.
                  </Text>
                  
                  {/* Palette Swatches */}
                  <View style={styles.paletteRow}>
                     {['#2F2F2F', '#F6F3EE', '#8DA399'].map((c, i) => (
                        <View key={i} style={[styles.swatchLarge, { backgroundColor: c }]} />
                     ))}
                     <TouchableOpacity style={styles.savePaletteBtn}>
                        <Ionicons name="bookmark-outline" size={20} color="#FFF" />
                     </TouchableOpacity>
                  </View>
               </View>
               <MaterialIcons name="palette" size={120} color="rgba(255,255,255,0.15)" style={styles.bgIcon} />
            </View>
          </View>
        )}

        {/* --- CVD SAFE PALETTES --- */}
        {activeCategory === 'All' && (
          <View style={styles.section}>
             <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, dText(18)]}>Accessible Combos</Text>
                <TouchableOpacity>
                   <Text style={{ color: palette.sage, fontWeight: '700', fontSize: 14 * scale }}>See All</Text>
                </TouchableOpacity>
             </View>
             
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                {PALETTES.map((p, idx) => (
                   <View key={idx} style={[styles.paletteCard, { backgroundColor: theme.card }]}>
                      <View style={styles.colorStrip}>
                         {p.colors.map((c, i) => (
                            <View key={i} style={[styles.miniSwatch, { backgroundColor: c }]} />
                         ))}
                      </View>
                      <View style={styles.paletteInfo}>
                         <Text style={[styles.paletteName, { color: theme.text, fontSize: 16 * scale }]}>{p.name}</Text>
                         <Text style={[styles.paletteDesc, { color: theme.subText, fontSize: 12 * scale }]}>{p.desc}</Text>
                      </View>
                   </View>
                ))}
             </ScrollView>
          </View>
        )}

        {/* --- MASONRY FEED --- */}
        <View style={styles.section}>
           <Text style={[styles.sectionTitle, dText(18), { marginBottom: 16 }]}>
              {activeCategory === 'All' ? 'Community Feed' : `${activeCategory} Feed`}
           </Text>
           
           {/* If no items found */}
           {filteredFeed.length === 0 ? (
             <View style={styles.emptyContainer}>
                <Ionicons name="images-outline" size={48} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>No inspiration found for this category yet.</Text>
             </View>
           ) : (
             <View style={styles.masonryContainer}>
                {filteredFeed.map((item) => (
                   <TouchableOpacity 
                      key={item.id} 
                      style={[styles.feedCard, { backgroundColor: theme.card }]}
                      activeOpacity={0.9}
                   >
                      <Image source={{ uri: item.image }} style={styles.feedImage} />
                      <View style={styles.feedContent}>
                         <View style={[styles.feedTag, { backgroundColor: palette.sage }]}>
                            <Text style={styles.feedTagText}>{item.tag}</Text>
                         </View>
                         <Text style={[styles.feedTitle, { color: theme.text, fontSize: 16 * scale }]}>
                            {item.title}
                         </Text>
                         <View style={styles.feedFooter}>
                            <Text style={{ color: theme.subText, fontSize: 12 * scale }}>by {item.author}</Text>
                            <View style={styles.likeRow}>
                               <Ionicons name="heart" size={14} color={palette.sage} />
                               <Text style={{ color: theme.text, fontSize: 12 * scale, marginLeft: 4 }}>{item.likes}</Text>
                            </View>
                         </View>
                      </View>
                   </TouchableOpacity>
                ))}
             </View>
           )}
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { marginTop: 4, fontWeight: '500' },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  scrollContent: { paddingBottom: 40 },
  
  // FILTERS
  filterScroll: { paddingHorizontal: 24, marginBottom: 24 },
  filterPill: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24, marginRight: 10,
    borderWidth: 1,
  },
  filterText: { fontWeight: '600' },

  // SECTIONS
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  // FEATURED CARD
  featuredCard: {
    borderRadius: 24, padding: 24,
    minHeight: 200, position: 'relative', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
    justifyContent: 'center'
  },
  featuredContent: { zIndex: 10 },
  tagBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  featuredTitle: { color: '#FFF', fontWeight: '800', marginBottom: 8 },
  featuredDesc: { color: 'rgba(255,255,255,0.9)', marginBottom: 20, maxWidth: '80%' },
  paletteRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatchLarge: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  savePaletteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  bgIcon: { position: 'absolute', right: -20, bottom: -20, opacity: 0.5 },

  // PALETTE CARDS
  paletteCard: {
    width: 200, borderRadius: 16, padding: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  colorStrip: { flexDirection: 'row', height: 40, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  miniSwatch: { flex: 1 },
  paletteInfo: { paddingVertical: 8 },
  paletteName: { fontWeight: '700', marginBottom: 2 },
  paletteDesc: { fontWeight: '500' },

  // MASONRY FEED
  masonryContainer: { gap: 16 },
  feedCard: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  feedImage: { width: '100%', height: 180 },
  feedContent: { padding: 16 },
  feedTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  feedTagText: { color: '#FFF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  feedTitle: { fontWeight: '700', marginBottom: 8 },
  feedFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  likeRow: { flexDirection: 'row', alignItems: 'center' },

  // EMPTY STATE
  emptyContainer: { alignItems: 'center', paddingVertical: 40, opacity: 0.6 },
  emptyText: { marginTop: 10, fontWeight: '500' },
});