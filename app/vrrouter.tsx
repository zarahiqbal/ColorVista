import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VRScreen from "../screens/VRscreen";

export type RootStackParamList = {
  VRSimulation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VRRouter() {
  return (
    <Stack.Navigator
      initialRouteName="VRSimulation"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="VRSimulation" component={VRScreen} />
    </Stack.Navigator>
  );
}
