import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VRFullScreenCamera from "../screens/VRFullScreenCamera";
import VRscreen from "../screens/VRscreen";

export type RootStackParamList = {
  VRSimulation: undefined;
  VRFullScreenCamera: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VRRouter() {
  return (
    <Stack.Navigator
      initialRouteName="VRSimulation"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="VRSimulation" component={VRscreen} />
      <Stack.Screen name="VRFullScreenCamera" component={VRFullScreenCamera} />
    </Stack.Navigator>
  );
}
