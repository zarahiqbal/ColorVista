// // import { router } from "expo-router";
// // import Welcome from "../screens/Welcome";

// // export default function WelcomeScreen() {
// //   return <Welcome onStart={() => router.push("/difficulty")} />;
// // }
// import { useRouter } from "expo-router";
// import Welcome from "../screens/Welcome";
// import { StyleSheet, Text, TouchableOpacity } from "react-native";

// export default function WelcomeScreen() {
//   const router = useRouter();

//   const handleStart = () => {
//     router.push("/difficulty");
//   };

//   return (
//     <TouchableOpacity style={styles.button} onPress={handleStart}>
//       <Text style={styles.buttonText}>Start Color Vision Test</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     padding: 16,
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
// });
import { useRouter } from "expo-router";
import Welcome from "../screens/Welcome";

export default function WelcomeScreen() {
  const router = useRouter();
  return <Welcome onStart={() => router.push("/difficulty")} />;
}
