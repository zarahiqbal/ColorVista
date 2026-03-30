import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Props
interface EnhancerScreenProps {
  onSaveImage: (imageUri?: string) => void;
  onSavePreferences: () => void;
  onApplySystem: () => void;
}

// CVD Types
type CVDType = "none" | "deuteranopia" | "protanopia" | "tritanopia";

export default function EnhancerScreen({
  onSaveImage,
  onSavePreferences,
  onApplySystem,
}: EnhancerScreenProps) {
  // Image
  const [imageUri, setImageUri] = useState(
    "https://picsum.photos/id/28/600/400",
  );

  // Enhancement sliders
  const [hueValue, setHueValue] = useState(0);
  const [contrastValue, setContrastValue] = useState(0);
  const [brightnessValue, setBrightnessValue] = useState(0);
  const [saturationValue, setSaturationValue] = useState(0);

  // Tooltip & comparison
  const [showOriginal, setShowOriginal] = useState(false);

  // Advanced CVD settings
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [cvdType, setCvdType] = useState<CVDType>("none");

  const formatPercent = (value: number) =>
    `${value >= 0 ? "+" : ""}${Math.round(value * 100)}%`;

  // CVD Matrices
  const cvdMatrices: Record<CVDType, number[]> = {
    none: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    deuteranopia: [
      0.625, 0.7, 0, 0, 0, 0.375, 0.3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
    ],
    protanopia: [
      0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0,
      0, 1, 0,
    ],
    tritanopia: [
      0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0,
      0, 1, 0,
    ],
  };

  // Function to pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "labels":
        Alert.alert("Feature Label Check", "Checking labels on the image.");
        break;
      case "prefs":
        Alert.alert(
          "Preferences Configuration",
          "Opening preferences configuration screen.",
        );
        break;
      case "applySystem":
        Alert.alert(
          "Apply to System",
          "Settings applied to the entire system.",
        );
        break;
      case "save":
        onSaveImage?.(imageUri);
        break;
      case "savePrefs":
        onSavePreferences();
        break;
      case "applySystemBtn":
        onApplySystem();
        break;
      default:
        console.warn(`Action ${actionId} not implemented.`);
    }
  };

  // Reusable Slider Card
  const SliderCard = ({
    label,
    subtext,
    icon,
    value,
    setValue,
    minValue,
    maxValue,
    showValueText,
  }: any) => (
    <View style={styles.controlCard}>
      <View style={styles.controlHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <Text style={styles.controlLabel}>{label}</Text>
        </View>
        <Text style={styles.controlValue}>{formatPercent(value)}</Text>
      </View>
      <Text style={styles.controlSubtext}>{subtext}</Text>
      {showValueText && (
        <Text style={styles.controlPercentLabel}>
          {(value * 100).toFixed(0)}%
        </Text>
      )}
      <Slider
        style={styles.slider}
        minimumValue={minValue}
        maximumValue={maxValue}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="#a1584c"
        maximumTrackTintColor="#d7d0ca"
        thumbTintColor="#a1584c"
      />
    </View>
  );

  const AdvancedActionItem = ({ iconName, text, hasCite, id }: any) => (
    <TouchableOpacity
      style={styles.advancedActionItem}
      onPress={() => handleAction(id)}
    >
      <View style={styles.advancedIconContainer}>
        {id === "prefs" ? (
          <FontAwesome5 name="cog" size={16} color="#43372f" />
        ) : (
          <Ionicons name={iconName} size={18} color="#43372f" />
        )}
      </View>
      <Text style={styles.advancedActionText}>
        {text} {hasCite && <Text style={styles.citeText}></Text>}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>
          IMAGE <Text style={styles.headerTitleEnhancer}>ENHANCER</Text>
        </Text>

        {/* Image Preview */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={styles.originalImage}
              resizeMode="cover"
            />

            {/* Compare Button */}
            <TouchableOpacity
              style={styles.compareButton}
              onPressIn={() => setShowOriginal(true)}
              onPressOut={() => setShowOriginal(false)}
            >
              <Text style={styles.compareButtonText}>
                {showOriginal ? "Showing Original" : "Hold to View Original"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add from Gallery Button */}
        <TouchableOpacity
          style={[
            styles.mainActionButton,
            { backgroundColor: "#a1584c", marginTop: -8, marginBottom: 24 },
          ]}
          onPress={pickImage}
        >
          <Ionicons
            name="image-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.mainActionButtonText}>SELECT FROM GALLERY</Text>
        </TouchableOpacity>

        {/* Enhancement Sliders */}
        <SliderCard
          label="HUE"
          subtext="Adjust color range."
          icon={
            <Ionicons name="color-palette-outline" size={24} color="#b19c8f" />
          }
          value={hueValue}
          setValue={setHueValue}
          minValue={-1}
          maxValue={1}
          showValueText
        />
        <SliderCard
          label="CONTRAST"
          subtext="Change intensity."
          icon={
            <MaterialCommunityIcons
              name="contrast-box"
              size={24}
              color="#b19c8f"
            />
          }
          value={contrastValue}
          setValue={setContrastValue}
          minValue={-1}
          maxValue={1}
          showValueText
        />
        <SliderCard
          label="BRIGHTNESS"
          subtext="Shift luminosity."
          icon={<Ionicons name="sunny-outline" size={24} color="#b19c8f" />}
          value={brightnessValue}
          setValue={setBrightnessValue}
          minValue={-1}
          maxValue={1}
          showValueText
        />
        <SliderCard
          label="SATURATION"
          subtext="Adjust color purity."
          icon={<Ionicons name="water-outline" size={24} color="#b19c8f" />}
          value={saturationValue}
          setValue={setSaturationValue}
          minValue={-1}
          maxValue={1}
          showValueText={false}
        />

        {/* CVD Type Selector */}
        <View style={{ flexDirection: "row", marginVertical: 12 }}>
          {["none", "deuteranopia", "protanopia", "tritanopia"].map((type) => (
            <TouchableOpacity
              key={type}
              style={{
                backgroundColor: cvdType === type ? "#a1584c" : "#eee",
                padding: 8,
                borderRadius: 8,
                marginRight: 8,
              }}
              onPress={() => setCvdType(type as CVDType)}
            >
              <Text style={{ color: cvdType === type ? "#fff" : "#43372f" }}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advanced CVD Settings */}
        <View style={styles.advancedSettingsCard}>
          <TouchableOpacity
            style={styles.advancedHeader}
            onPress={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="glasses-outline"
                size={24}
                color="#43372f"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.advancedTitle}>Advanced CVD Settings</Text>
            </View>
            <Ionicons
              name={isAdvancedOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#43372f"
            />
          </TouchableOpacity>
          {isAdvancedOpen && (
            <View style={styles.advancedContent}>
              <AdvancedActionItem
                iconName="tag-outline"
                text="Check color feature labels."
                hasCite={false}
                id="labels"
              />
              <AdvancedActionItem
                iconName="settings-outline"
                text="Configure custom preferences."
                hasCite={false}
                id="prefs"
              />
              <AdvancedActionItem
                iconName="checkmark-circle-outline"
                text="Apply settings to the system."
                hasCite={true}
                id="applySystem"
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.mainActionButton}
          onPress={() => handleAction("save")}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.mainActionButtonText}>SAVE ENHANCED IMAGE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    color: "#43372f",
    marginBottom: 20,
    textAlign: "center",
  },
  headerTitleEnhancer: { color: "#a1584c" },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    aspectRatio: 3 / 2,
    backgroundColor: "#eee",
  },
  originalImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  compareButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  compareButtonText: { color: "#43372f", fontSize: 10, fontWeight: "bold" },
  controlCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  controlLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#43372f",
    marginLeft: 8,
  },
  controlValue: { fontSize: 18, color: "#b19c8f" },
  controlSubtext: {
    fontSize: 12,
    color: "#b19c8f",
    marginBottom: 8,
    marginLeft: 32,
  },
  controlPercentLabel: {
    position: "absolute",
    bottom: 24,
    right: 16,
    fontSize: 12,
    color: "#43372f",
    opacity: 0.7,
  },
  slider: { width: "100%", height: 40, marginLeft: 8 },
  advancedSettingsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  advancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  advancedTitle: { fontSize: 18, color: "#43372f", fontWeight: "bold" },
  advancedContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  advancedActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  advancedIconContainer: { width: 28, alignItems: "center", marginRight: 8 },
  advancedActionText: { flex: 1, fontSize: 14, color: "#43372f" },
  citeText: { fontSize: 12, color: "#43372f", opacity: 0.8 },
  mainActionButton: {
    flexDirection: "row",
    backgroundColor: "#262626",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mainActionButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
