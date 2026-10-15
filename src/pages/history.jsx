import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TripLog from "../components/tripLog";
import { subscribeToUserTrips } from "../dbUtility";
import { Image } from "react-native";

const COLORS = {
  blue: "#6798FC",
  ecoGreen: "#C1EABB",
  yellow: "#FFE199",
  pinkCTA: "#FF4C7A",
  white: "#FFFFFF",
  black: "#000000",
  darkText: "#1C1C1E",
  lightGray: "#e6e6e6",
  borderGray: "#E5E5EA",
};

function History({ navigation }) {
    const [trips, setTrips] = useState([]);
    const [dbChecked, setDbChecked] = useState(false);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["10%","30%", "45%"], []);

    // Subscribe to Firestore trips in real-time
    useEffect(() => {
        const unsubscribe = subscribeToUserTrips(
            (data) => {
                setTrips(data);
                setDbChecked(true);
            },
            (error) => {
                console.error("Error loading trips:", error);
                setDbChecked(true);
            }
        );

        return () => unsubscribe();
    }, []);

    // Calculate aggregate eco metrics
    const totalOffset = trips
        .reduce((sum, t) => sum + ((t.carbonOffset || 0) * (t.journeys || 1)), 0)
        .toFixed(1);

    const totalJourneys = trips.reduce((sum, t) => sum + (t.journeys || 1), 0);

    if (!dbChecked) {
        return (
            <View style={styles.historyThrobberContainer}>
                <Text style={styles.loadingText}>Loading Trips...</Text>
                <ActivityIndicator size="large" color={COLORS.pinkCTA} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.historyContainer}>
            {/* Top Navigation Bar */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Emissions Diary</Text>
                <View>
                    <Pressable style={styles.mapButton} onPress={() => navigation.navigate("Mapping")}>
                        <Image style={styles.mapButtonIcon} source={require("../../assets/icons/Mapping.png")}/>
                    </Pressable>
                    <Text style={styles.mapButtonText}>Map Route</Text>
                </View>
            </View>

            {/* Saved Trips List */}
            <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                {trips.length > 0 ? (
                    trips.map((element, index) => (
                        <TripLog key={element.id || index} trip={element} navigation={navigation} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>You have saved no trips</Text>
                        <Text style={styles.emptySubText}>Map a route and save it to start logging your carbon offset!</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Sheet Summary Stats */}
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                handleIndicatorStyle={{ backgroundColor: COLORS.blue, width: 40 }}
                backgroundStyle={{ backgroundColor: COLORS.yellow }}
            >
                <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>Impact Summary</Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{totalOffset} kg</Text>
                            <Text style={styles.statLabel}>CO₂ Saved</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{totalJourneys}</Text>
                            <Text style={styles.statLabel}>Journeys</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{trips.length}</Text>
                            <Text style={styles.statLabel}>Saved Routes</Text>
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

export default History;

const styles = StyleSheet.create({
    historyContainer: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        paddingTop: 50,
    },
    historyThrobberContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightGray,
        gap: 12,
    },
    loadingText: {
        fontFamily: "Open Sans",
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.darkText,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontFamily: "Open Sans",
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.darkText,
    },
    mapButton: {
        width: 60,
        borderColor: COLORS.blue,
        borderWidth: 1.5,
        borderRadius: 75,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    mapButtonIcon: {
        margin: "auto",
        width: 55,
        height: 55
    },
    mapButtonText: {
        fontFamily: "Open Sans",
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.darkText,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 160,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 40,
        gap: 8,
    },
    emptyText: {
        fontFamily: "Open Sans",
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.darkText,
    },
    emptySubText: {
        fontFamily: "Open Sans",
        fontSize: 13,
        color: "#666666",
        textAlign: "center",
        paddingHorizontal: 30,
    },
    sheetContent: {
        padding: 20,
        gap: 16,
    },
    sheetTitle: {
        fontFamily: "Open Sans",
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.darkText,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    statNumber: {
        fontFamily: "Open Sans",
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.black,
    },
    statLabel: {
        fontFamily: "Open Sans",
        fontSize: 11,
        fontWeight: "600",
        color: "#666666",
        marginTop: 2,
    },
});