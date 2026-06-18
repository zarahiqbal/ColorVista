// app/advanced-entry.tsx
// Route for advanced mode: shows Ishihara plates (advanced) → HueTest → Result

import { useConfirmLeaveQuizOnBack } from "../hooks/useBackNavigation";
import AdvancedModeEntry from "../screens/Advancedmodeentry";

export default function AdvancedEntryRoute() {
  useConfirmLeaveQuizOnBack();

  return <AdvancedModeEntry />;
}
