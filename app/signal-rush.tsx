import SignalRush from "../screens/SignalRush";
import { useGoBackOrHomeOnBack } from "../hooks/useBackNavigation";

export default function SignalRushRoute() {
  useGoBackOrHomeOnBack();

  return <SignalRush />;
}
