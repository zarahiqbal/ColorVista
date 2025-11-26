import { View, Text, StyleSheet } from "react-native";

export default function Live() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Live Detection Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 26, fontWeight: "bold" },
});
