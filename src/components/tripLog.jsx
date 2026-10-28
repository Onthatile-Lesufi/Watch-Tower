import React from "react";
import { Text, StyleSheet, View, Pressable, Alert } from "react-native";
import { logJourneyTaken, decrementJourneyTaken, deleteTripPlan } from "../dbUtility";

const COLORS = {
  blue: "#6798FC",
  ecoGreen: "#C1EABB",
  yellow: "#FFE199",
  white: "#FFFFFF",
  darkText: "#1C1C1E",
  lightGray: "#F4F5F7",
  borderGray: "#E5E5EA",
  pinkCTA: "#FF4C7A",
  disabledGray: "#C7C7CC",
};

function TripLog({ navigation, trip }) {
  if (!trip) return null;

  const legsCount = trip.legs?.length || 0;
  const journeysCount = trip.journeys || 0;

  const handleIncrement = async () => {
    if (!trip.id) return;
    try {
      await logJourneyTaken(trip.id);
    } catch (error) {
      console.error("Error logging journey:", error);
    }
  };

  const handleDecrement = async () => {
    if (!trip.id || journeysCount <= 0) return;
    try {
      await decrementJourneyTaken(trip.id, journeysCount);
    } catch (error) {
      console.error("Error decrementing journey:", error);
    }
  };

  const handleDelete = () => {
    if (!trip.id) return;

    Alert.alert(
      "Delete Saved Trip",
      "Are you sure you want to remove this route from your Emissions Diary?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteTripPlan(trip.id);
            } catch (error) {
              console.error("Error deleting trip:", error);
            }
          } 
        },
      ]
    );
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

      {/* Action Bar */}
      <View style={styles.actionsRow}>
        <View style={styles.counterGroup}>
          <Pressable 
            style={[styles.counterBtn, journeysCount <= 0 && styles.disabledBtn]} 
            onPress={handleDecrement}
            disabled={journeysCount <= 0}
          >
            <Text style={[styles.counterBtnText, journeysCount <= 0 && styles.disabledBtnText]}>
              - 1
            </Text>
          </Pressable>

          <Pressable style={styles.counterBtnPrimary} onPress={handleIncrement}>
            <Text style={styles.counterBtnPrimaryText}>+ 1</Text>
          </Pressable>
        </View>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default TripLog;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.pinkCTA,
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    gap: 10,
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
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  counterGroup: {
    flexDirection: "row",
    gap: 6,
  },
  counterBtn: {
    backgroundColor: COLORS.pinkCTA,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  counterBtnText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    
  },
  counterBtnPrimary: {
    backgroundColor: COLORS.blue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  counterBtnPrimaryText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  disabledBtn: {
    backgroundColor: "#F2F2F7",
    borderColor: "#E5E5EA",
  },
  disabledBtnText: {
    color: COLORS.disabledGray,
  },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteBtnText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "700",
    color: "#FF3B30",
  },
});