import ProfileScreen from '../../screens/UserProfile';
import { useGoToDashboardOnBack } from '../../hooks/useBackNavigation';

export default function ProfileRoute() {
  useGoToDashboardOnBack();

  return <ProfileScreen />;
}
