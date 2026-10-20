import React from "react";
import { Pressable, Text, StyleSheet, View, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const COLORS = {
  blue: "#6798FC",
  ecoGreen: "#C1EABB",
  yellow: "#FFE199",
  pinkCTA: "#FF4C7A",
  white: "#FFFFFF",
  darkText: "#1C1C1E",
  lightGray: "#F4F5F7",
  borderGray: "#E5E5EA",
};

function Settings({ navigation }) {
    const currentUser = auth.currentUser;

    async function OnLogOut() {
        try {
            await signOut(auth);
            navigation.replace("Auth");
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Error", "Could not sign out right now. Please try again.");
        }
    }

    return (
        <View style={styles.settingContainer}>
            {/* Top Bar with Back Button */}
            <View style={styles.headerRow}>
                <Pressable  style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </Pressable>
            </View>

            <Text style={styles.settingsTitle}>Settings</Text>

            {/* Account Info Card */}
            <View style={styles.profileCard}>
                <Text style={styles.profileLabel}>Signed in as</Text>
                <Text style={styles.profileEmail}>{currentUser?.email || "User"}</Text>
            </View>

            {/* App Info Box */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Watch Tower</Text>
                <Text style={styles.infoSubtitle}>Version 1.0.0 • Eco Urbanist Transit Planner</Text>
            </View>

            {/* Logout Action Button */}
            <Pressable style={styles.settingsButton} onPress={OnLogOut}>
                <Text style={styles.settingsButtonText}>Log Out</Text>
            </Pressable>
        </View>
    );
}

export default Settings;

const styles = StyleSheet.create({
    settingContainer: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: COLORS.blue,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 2
    },
    backText: {
        fontFamily: "Open Sans",
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.white,
    },
    settingsTitle: {
        fontSize: 32,
        letterSpacing: 1,
        marginBottom: 24,
        fontWeight: "700",
        fontFamily: "Open Sans",
        color: COLORS.darkText,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.borderGray,
    },
    profileLabel: {
        fontFamily: "Open Sans",
        fontSize: 12,
        color: "#666666",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    profileEmail: {
        fontFamily: "Open Sans",
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.darkText,
        marginTop: 4,
    },
    infoCard: {
        backgroundColor: COLORS.yellow,
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
    },
    infoTitle: {
        fontFamily: "Open Sans",
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.darkText,
    },
    infoSubtitle: {
        fontFamily: "Open Sans",
        fontSize: 12,
        color: COLORS.darkText,
        marginTop: 2,
    },
    settingsButton: {
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.pinkCTA,
        borderRadius: 12,
        marginTop: "auto",
        marginBottom: 40,
    },
    settingsButtonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "700",
        fontFamily: "Open Sans",
    },
});