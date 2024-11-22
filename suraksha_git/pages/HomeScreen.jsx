import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";

export default function HomeScreen() {

  // SOS button
  const handleRedButtonPress = () => {
    Alert.alert("SOS Button is clicked we will alert the authorities");
  };

  // "Call a Volunteer" button
  const handleVolunteerButtonPress = () => {
    Alert.alert("Calling a Volunteer ()!");
  };

  return (
    <View style={styles.container}>
      {/* Logo and App Name at the top left */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/app.png")} style={styles.logo} />
        <Text style={styles.appName}>Suraksha</Text>
      </View>

      {/* Centered SOS Button */}
      <TouchableOpacity
        style={styles.redButton}
        onPress={handleRedButtonPress}
      >
        <Text style={styles.buttonText}>SOS</Text>
      </TouchableOpacity>

      {/* "Call a Volunteer" Button */}
      <TouchableOpacity
        style={styles.volunteerButton}
        onPress={handleVolunteerButtonPress}
      >
        <Text style={styles.volunteerButtonText}>Call a Volunteer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE5D9",
  },
  logoContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  redButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EC1B22",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  volunteerButton: {
    position: "absolute",
    bottom: "25%",
    width: "80%",
    borderRadius: 100,
    paddingVertical: 15,
    backgroundColor: "lightcoral",
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  volunteerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
