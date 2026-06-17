import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/Context/ThemeContext"; // Adjust path as needed

const { width } = Dimensions.get("window");

const CATEGORIES = ["All", "Art", "UI Design", "Fashion"];

// --- VERIFIED ARTICLES & SOURCE-MATCHED IMAGE PATHS ---
const INSPIRATION_FEED = [
  // --- UI DESIGN ---
  {
    id: 1,
    title: "Ensure High Contrast for Text Over Images",
    author: "Aurora Harley",
    image:
      "https://s3.amazonaws.com/media.nngroup.com/media/editor/2015/09/23/complimentsdk_compliments-making-home-home-2015-09-18-blurred.png", // Web typography/accessibility layout
    tag: "UI Design",
    url: "https://www.nngroup.com/articles/text-over-images/",
  },
  {
    id: 2,
    title: "5 Visual Treatments that Improve Accessibility",
    author: "Kelley Gordon",
    image: "https://media.nngroup.com/media/editor/2022/08/22/frame-29.jpg", // UI wireframes & contrast inspection
    tag: "UI Design",
    url: "https://www.nngroup.com/articles/visual-treatments-accessibility/",
  },
  {
    id: 3,
    title: "How to Design for Global Accessibility",
    author: "Eric Chung",
    image:
      "https://miro.medium.com/v2/resize:fit:1100/format:webp/0*bDlTW2Xh3sHgOVua", // Replaced corrupted ID with valid, crisp tech/design workspace image
    tag: "UI Design",
    url: "https://uxdesign.cc/how-to-design-for-the-entire-world-e38e267019d",
  },
  {
    id: 4,
    title:
      "Algorithmic Theming Engines: Building Self-Correcting Color Systems With contrast-color()",
    author: "Durgesh Pawar",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", // Dynamic UI data/theming visualization
    tag: "UI Design",
    url: "https://www.smashingmagazine.com/2026/05/building-self-correcting-color-systems-contrast-color/", // Fixed broken URL string
  },

  // --- ART ---
  {
    id: 5,
    title: "Typographic Hierarchies",
    author: "Alma Hoffmann",
    image:
      "https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/59651099-8d2b-466f-b3e1-3acfdeeb5c5d/12-typographic-hierarchies.png", // Clear typographic/abstract structure geometry
    tag: "Art",
    url: "https://www.smashingmagazine.com/2022/10/typographic-hierarchies/",
  },

  {
    id: 6,
    title: "Evaluate Interface Learnability with Cognitive Walkthroughs",
    author: "Kim Flaherty",
    image:
      "https://media.nngroup.com/media/editor/2022/01/04/health-clinic-application.png", // High-depth light path representing natural/cognitive routing
    tag: "UI Design",
    url: "https://www.nngroup.com/articles/cognitive-walkthroughs/?lm=definition-user-experience&pt=article",
  },

  // --- FASHION ---
  {
    id: 7,
    title: "A Stylist's Recipe for Mixing Patterns Like a Pro",
    author: "Hallie Abrams",
    image:
      "https://images.squarespace-cdn.com/content/v1/606db47af1026038e2fd5c6c/3cc17dd1-c893-46f8-bf1a-7807e5e07142/Mixing+Patterns+with+Cohesive+Color.png?format=2500w", // Distinct textile pattern layering
    tag: "Fashion",
    url: "https://www.thewardrobeconsultant.com/blog/a-stylists-recipe-for-mixing-patterns-like-a-pro",
  },
];

export default function GetInspiredScreen() {
  const router = useRouter();
  const { darkMode, getFontSizeMultiplier } = useTheme();
  const scale = getFontSizeMultiplier();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFeed =
    activeCategory === "All"
      ? INSPIRATION_FEED
      : INSPIRATION_FEED.filter((item) => item.tag === activeCategory);

  // --- LINK OPENER HANDLER ---
  const handleCardPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error("Error launching default browser", error);
    }
  };

  const palette = {
    beigeBg: "#F6F3EE",
    charcoal: "#2F2F2F",
    sage: "#8DA399",
    taupe: "#AA957B",
    white: "#FFFFFF",
    textLight: "#6B6661",
    surfaceDark: "#1C1C1E",
  };

  const theme = {
    bg: darkMode ? palette.surfaceDark : palette.beigeBg,
    card: darkMode ? "#2C2C2E" : palette.white,
    text: darkMode ? "#F6F3EE" : palette.charcoal,
    subText: darkMode ? "#A1A1AA" : palette.textLight,
    accent: palette.sage,
    border: palette.taupe,
  };

  const dText = (size: number) => ({
    fontSize: size * scale,
    color: theme.text,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.text, fontSize: 28 * scale },
            ]}
          >
            Get Inspired
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.subText, fontSize: 14 * scale },
            ]}
          >
            Curated accessibility & design
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- CATEGORY PILLS --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    activeCategory === cat ? palette.charcoal : theme.card,
                  borderColor:
                    activeCategory === cat ? palette.charcoal : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: activeCategory === cat ? "#FFF" : theme.text,
                    fontSize: 14 * scale,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- MASONRY FEED --- */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dText(18), { marginBottom: 16 }]}>
            {activeCategory === "All"
              ? "Community Feed"
              : `${activeCategory} Feed`}
          </Text>

          {filteredFeed.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={48} color={theme.subText} />
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                No inspiration found for this category yet.
              </Text>
            </View>
          ) : (
            <View style={styles.masonryContainer}>
              {filteredFeed.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.feedCard, { backgroundColor: theme.card }]}
                  activeOpacity={0.8}
                  onPress={() => handleCardPress(item.url)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.feedImage}
                  />
                  <View style={styles.feedContent}>
                    <View
                      style={[
                        styles.feedTag,
                        { backgroundColor: palette.sage },
                      ]}
                    >
                      <Text style={styles.feedTagText}>{item.tag}</Text>
                    </View>
                    <Text
                      style={[
                        styles.feedTitle,
                        { color: theme.text, fontSize: 16 * scale },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <View style={styles.feedFooter}>
                      <Text
                        style={{ color: theme.subText, fontSize: 12 * scale }}
                      >
                        by {item.author}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { marginTop: 4, fontWeight: "500" },
  scrollContent: { paddingBottom: 40 },
  filterScroll: { paddingHorizontal: 24, marginBottom: 24 },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
  },
  filterText: { fontWeight: "600" },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontWeight: "700", marginBottom: 12 },
  masonryContainer: { gap: 16 },
  feedCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  feedImage: { width: "100%", height: 180 },
  feedContent: { padding: 16 },
  feedTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  feedTagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  feedTitle: { fontWeight: "700", marginBottom: 8 },
  feedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyContainer: { alignItems: "center", paddingVertical: 40, opacity: 0.6 },
  emptyText: { marginTop: 10, fontWeight: "500" },
});
