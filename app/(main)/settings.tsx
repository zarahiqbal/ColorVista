import SettingsPage from '../../screens/Settings';
import { useGoToDashboardOnBack } from '../../hooks/useBackNavigation';

export default function SettingsRoute() {
  useGoToDashboardOnBack();

  return <SettingsPage />;
}
