import GetInspiredScreen from '../screens/GetInspired';
import { useGoBackOrHomeOnBack } from '../hooks/useBackNavigation';

export default function GetInspiredRoute() {
  useGoBackOrHomeOnBack();

  return <GetInspiredScreen />;
}
