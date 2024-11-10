import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { PageView } from "@/components/page-view/page-view";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  const logout = () => {
    // TODO: Add logout logic here
    router.push("/login");
  };

  return (
    <PageView>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
