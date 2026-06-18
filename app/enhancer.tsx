import EnhancerScreen from "../enhancer";
import { useGoBackOrHomeOnBack } from "../hooks/useBackNavigation";

export default function Enhancer() {
  useGoBackOrHomeOnBack();

  return (
    <EnhancerScreen
      onSaveImage={(uri) => console.log("Saved:", uri)}
      onSavePreferences={() => console.log("Preferences saved")}
      onApplySystem={() => console.log("Applied system-wide")}
    />
  );
}
