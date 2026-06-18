import ColorDetective from "../screens/ColorDetective";
import { useGoBackOrHomeOnBack } from "../hooks/useBackNavigation";

export default function ColorDetectiveRoute() {
  useGoBackOrHomeOnBack();

  return <ColorDetective />;
}
