import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, Text, Pressable, View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { queryGeminiTransit } from "../llmChat";
import { createTripPlan } from "../dbUtility";
import { Image } from "react-native";

// Watch Tower Color Palette
const COLORS = {
  blue: "#6798FC",
  ecoGreen: "#C1EABB",
  yellow: "#FFE199",
  pinkCTA: "#FF4C7A",
  white: "#FFFFFF",
  black: "#000000",
  darkText: "#1C1C1E",
  lightGray: "#F4F5F7",
  borderGray: "#E5E5EA",
};

function Mapping({ navigation }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["22%", "60%", "92%"], []);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  const handleMapTrip = async () => {
    if (!destination) return;
    setIsAnalyzing(true);

    const prompt = `Plan a trip from ${origin || "my current location"} to ${destination}`;
    const result = await queryGeminiTransit(prompt);

    setTripData(result);
    setIsAnalyzing(false);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleSaveTrip = async () => {
    if (!tripData) return;
    setIsSaving(true);

    try {
      await createTripPlan({
        origin: origin || "Current Location",
        destination: destination,
        distance: tripData.totalDistanceKm,
        totalDuration: tripData.totalDurationMinutes,
        carbonOffset: tripData.estimatedCarbonSavedKg,
        legs: tripData.legs,
      });

      Alert.alert(
        "Trip Saved!",
        "This route has been logged to your Watch Tower carbon diary."
      );
    } catch (error) {
      Alert.alert("Save Error", "Could not save trip to your database.");
    } finally {
      setIsSaving(false);
    }
  };

  const lat = location?.coords?.latitude || -26.1952;
  const lng = location?.coords?.longitude || 28.0340;

  // Leaflet HTML with safely escaped JS strings to prevent single-quote crashes
  const leafletHTML = useMemo(() => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { margin: 0; padding: 0; }
                #map { height: 100vh; width: 100vw; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 13);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                ${tripData ? `
                    var oLat = ${tripData.originCoords.lat};
                    var oLng = ${tripData.originCoords.long};
                    var dLat = ${tripData.destinationCoords.lat};
                    var dLng = ${tripData.destinationCoords.long};

                    var originMarker = L.marker([oLat, oLng])
                      .addTo(map)
                      .bindPopup("Origin - " + ${JSON.stringify(origin || "Origin")});
                    var destMarker = L.marker([dLat, dLng])
                      .addTo(map)
                      .bindPopup("Destination - " + ${JSON.stringify(destination || "Destination")});

                    var bounds = L.latLngBounds([[oLat, oLng], [dLat, dLng]]);
                    map.fitBounds(bounds, { padding: [50, 50] });
                ` : `
                    L.marker([${lat},${lng}]).addTo(map).bindPopup("Current Location");
                `}
            </script>
        </body>
    </html>
  `, [lat, lng, tripData, origin, destination]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.pinkCTA} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: leafletHTML }}
        style={styles.map}
        scrollEnabled={false}
      />

      <Pressable
        style={styles.historyFloatingButton}
        onPress={() => navigation.navigate("History")}
      >
        <Image style={styles.historyFloatingButtonIcon} source={require('../../assets/icons/History.png')}/>
      </Pressable>
      <Pressable
        style={styles.settingsFloatingButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Image style={styles.historyFloatingButtonIcon} source={require('../../assets/icons/Settings.png')}/>
      </Pressable>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: COLORS.blue, width: 40 }}
        backgroundStyle={{ backgroundColor: COLORS.yellow }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>Watch Tower Planner</Text>
            <View style={styles.ecoBadge}>
              <Text style={styles.ecoBadgeText}>Carbon Offset Calculator</Text>
            </View>
          </View>

          <BottomSheetTextInput
            style={styles.input}
            placeholder="Starting Point (or Current Location)"
            placeholderTextColor="#8E8E93"
            value={origin}
            onChangeText={setOrigin}
          />

          <BottomSheetTextInput
            style={styles.input}
            placeholder="Where are you heading?"
            placeholderTextColor="#8E8E93"
            value={destination}
            onChangeText={setDestination}
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleMapTrip}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Map Eco Trip</Text>
            )}
          </Pressable>

          {/* Optimal Trip Breakdown Output */}
          {tripData && (
            <View style={styles.breakdownContainer}>
              
              {/* Trip Overview Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>{tripData.summary}</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statChip}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>{tripData.totalDurationMinutes} mins</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{tripData.totalDistanceKm} km</Text>
                  </View>
                </View>

                <View style={styles.offsetHighlight}>
                  <Text style={styles.offsetText}>
                    Saves ~{tripData.estimatedCarbonSavedKg} kg CO₂e vs driving!
                  </Text>
                </View>
              </View>

              {/* Step-by-Step Leg Breakdown Timeline */}
              <Text style={styles.sectionHeader}>Itinerary Breakdown</Text>
              
              {tripData.legs?.map((leg, index) => (
                <View key={index} style={styles.legCard}>
                  <View style={styles.legBadge}>
                    <Text style={styles.legBadgeText}>{leg.mode}</Text>
                  </View>
                  <View style={styles.legDetails}>
                    <Text style={styles.legInstruction}>{leg.instruction}</Text>
                    {leg.lineName && (
                      <Text style={styles.legSubText}>Line: {leg.lineName}</Text>
                    )}
                  </View>
                  <Text style={styles.legDuration}>{leg.durationMinutes}m</Text>
                </View>
              ))}

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  (pressed || isSaving) && { opacity: 0.8 },
                ]}
                onPress={handleSaveTrip}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={COLORS.black} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Trip to Diary</Text>
                )}
              </Pressable>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

export default Mapping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  historyFloatingButton: {
    position: "absolute",
    width: "auto",
    height: "auto",
    top: 60,
    right: 20,
    borderColor: COLORS.blue,
    borderWidth: 1.5,
    borderRadius: 750,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  settingsFloatingButton: {
    position: "absolute",
    width: "auto",
    height: "auto",
    top: 130,
    right: 20,
    borderColor: COLORS.blue,
    borderWidth: 1.5,
    borderRadius: 750,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  historyFloatingButtonIcon: {
    margin: "auto",
    width: 55,
    height: 55
  },
  sheetContent: {
    padding: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: "column",
    gap: 6,
    marginBottom: 4,
  },
  sheetTitle: {
    fontFamily: "Open Sans",
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  ecoBadge: {
    backgroundColor: COLORS.ecoGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  ecoBadgeText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.black,
  },
  input: {
    fontFamily: "Open Sans",
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.yellow,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
  },
  primaryButton: {
    backgroundColor: COLORS.pinkCTA,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.pinkCTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 4,
  },
  primaryButtonText: {
    fontFamily: "Open Sans",
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.ecoGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontFamily: "Open Sans",
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 16,
  },
  breakdownContainer: {
    marginTop: 10,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.yellow,
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  summaryText: {
    fontFamily: "Open Sans",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statLabel: {
    fontFamily: "Open Sans",
    fontSize: 10,
    color: "#666",
  },
  statValue: {
    fontFamily: "Open Sans",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  offsetHighlight: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
  },
  offsetText: {
    fontFamily: "Open Sans",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  sectionHeader: {
    fontFamily: "Open Sans",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.darkText,
    marginTop: 6,
  },
  legCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 10,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue,
  },
  legBadge: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  legBadgeText: {
    fontFamily: "Open Sans",
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
  legDetails: {
    flex: 1,
  },
  legInstruction: {
    fontFamily: "Open Sans",
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.darkText,
  },
  legSubText: {
    fontFamily: "Open Sans",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  legDuration: {
    fontFamily: "Open Sans",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.darkText,
  },
});