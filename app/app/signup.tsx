import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useFocusEffect, useRouter } from "expo-router";

export default function SignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (!phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    //TODO: Signup logic here

    router.push("/chats");
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
      };
    }, []),
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.noAccountText}>
          Already have an account?{" "}
          <Text style={styles.signupText} onPress={() => router.push("/login")}>
            Log In
          </Text>
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1D3D47",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noAccountText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#1D3D47",
  },
  signupText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D3D47",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
    color: "#1D3D47",
    backgroundColor: "#A1CEDC",
  },
});
