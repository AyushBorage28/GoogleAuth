import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "1085122621880-va7ii1t05vvggtk76et1mvfeh7jacent.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function App() {
  const [isInProgress, setIsInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async () => {
    setIsInProgress(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("Sign in response: ", response.data);
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);

        Toast.show({
          type: "success",
          text1: "Signed in!",
          text2: `Hello, ${response.data.user.name}`,
        });
      } else {
        console.log("User cancelled the sign-in flow");

        Toast.show({
          type: "info",
          text1: "Sign‐in Cancelled",
          text2: "No user data returned.",
        });
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Sign in is already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available or outdated");
            break;
          default:
            console.log("An error occurred: ", error.message);
        }
      } else {
        console.log("An unexpected error occurred: ", error);
        Toast.show({
          type: "error",
          text1: "Unexpected Error",
          text2: error.toString(),
        });
      }
    } finally {
      setIsInProgress(false);
    }
  };

  const signOut = async () => {
    setIsInProgress(true);
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Toast.show({
        type: "success",
        text1: "Signed out",
        text2: "You have been logged out successfully.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign‐out Error",
        text2: error.toString(),
      });
    } finally {
      setIsInProgress(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Google Sign-In Demo</Text>

        {userInfo ? (
          <>
            {/* Profile Image */}
            <Image
              source={{ uri: userInfo.user.photo }}
              style={styles.profileImage}
            />

            {/* Greeting */}
            <Text style={styles.greeting}>Hello, {userInfo.user.name}!</Text>

            {/* Sign Out Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={signOut}
              disabled={isInProgress}
            >
              {isInProgress ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Subtitle when not signed in */}
            <Text style={styles.subtitle}>Please sign in to continue.</Text>

            {/* Google Sign-In Button */}
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
              disabled={isInProgress}
            />
          </>
        )}
      </View>

      <StatusBar style="auto" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: "100%",
    maxWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
