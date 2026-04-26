import EnhancerScreen from "../enhancer";

export default function Enhancer() {
  return (
    <EnhancerScreen
      onSaveImage={(uri) => console.log("Saved:", uri)}
      onSavePreferences={() => console.log("Preferences saved")}
      onApplySystem={() => console.log("Applied system-wide")}
    />
  );
}
