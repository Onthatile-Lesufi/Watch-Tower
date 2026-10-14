import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { logJourneyTaken } from "../dbUtility";

// Watch Tower Color Palette
const COLORS = {
  blue: "#6798FC",
  ecoGreen: "#C1EABB",
  yellow: "#FFE199",
  white: "#FFFFFF",
  darkText: "#1C1C1E",
  lightGray: "#F4F5F7",
  borderGray: "#E5E5EA",
};

function TripLog({ navigation, trip }) {
  // Safety guard in case trip object hasn't loaded yet
  if (!trip) return null;

  const legsCount = trip.legs?.length || 0;
  const journeysCount = trip.journeys || 0;

  const handleLog = async () => {
    if (!trip.id) return;
    try {
      await logJourneyTaken(trip.id);
    } catch (error) {
      console.error("Error logging journey:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.routeText}>
          {trip.origin || "Origin"} {"\u279C"} {trip.destination || "Destination"}
        </Text>
        <View style={styles.offsetBadge}>
          <Text style={styles.offsetBadgeText}>
            {trip.carbonOffset || 0}kg CO₂e
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.metaText}>
          {trip.distance || 0} km  •  {trip.totalDuration || 0} mins  •  {legsCount} {legsCount === 1 ? "Leg" : "Legs"}  •  {journeysCount} {journeysCount === 1 ? "Journey" : "Journeys"}
        </Text>
      </View>

      <Pressable style={styles.logButton} onPress={handleLog}>
        <Text style={styles.logButtonText}>+ Log Journey</Text>
      </Pressable>
    </View>
  );
}

export default TripLog;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeText: {
    fontFamily: "Open Sans",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.darkText,
    flex: 1,
    marginRight: 8,
  },
  offsetBadge: {
    backgroundColor: COLORS.ecoGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offsetBadgeText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
  },
  logButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  logButtonText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});