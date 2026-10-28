import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";

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

const SLIDES = [
  {
    icon: require("../../assets/icons/Mapping.png"),
    title: "AI Multi-Modal Routing",
    subtitle: "Plan Eco-Friendly Routes",
    description: "Get optimal transit itineraries combining walking, buses, and rail powered by Google Gemini AI.",
  },
  {
    icon: require("../../assets/icons/History.png"),
    title: "Carbon Offset Tracking",
    subtitle: "Measure Your Savings",
    description: "Quantify your exact CO₂ reduction in real-time compared to driving a gasoline vehicle.",
  },
  {
    icon: require("../../assets/icons/Tally.png"),
    title: "Emissions Diary",
    subtitle: "Log Daily Commutes",
    description: "Save your frequent routes and log repeat journeys with a single tap to track your long-term impact.",
  },
];

function Onboarding({ navigation }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      navigation.replace("Mapping");
    }
  };

  const handleSkip = () => {
    navigation.replace("Mapping");
  };

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <View style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topRow}>
        <Text style={styles.brandTitle}>Watch Tower</Text>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main Slide Card */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Image style={styles.iconImage} source={currentSlide.icon} />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.slideSubtitle}>{currentSlide.subtitle}</Text>
          <Text style={styles.slideTitle}>{currentSlide.title}</Text>
          <Text style={styles.slideDescription}>{currentSlide.description}</Text>
        </View>
      </View>

      {/* Footer with Dots & Next Button */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlideIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.ctaButtonText}>
            {currentSlideIndex === SLIDES.length - 1 ? "Get Started" : "Next ➔"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: {
    fontFamily: "Open Sans",
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  skipText: {
    fontFamily: "Open Sans",
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.blue,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.yellow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconImage: {
    width: 87,
    height: 87,
    resizeMode: "contain",
  },
  textGroup: {
    alignItems: "center",
    gap: 8,
  },
  slideSubtitle: {
    fontFamily: "Open Sans",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.blue,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  slideTitle: {
    fontFamily: "Open Sans",
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.darkText,
    textAlign: "center",
  },
  slideDescription: {
    fontFamily: "Open Sans",
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 6,
  },
  footer: {
    gap: 24,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.pinkCTA,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: COLORS.borderGray,
  },
  ctaButton: {
    backgroundColor: COLORS.pinkCTA,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.pinkCTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaButtonText: {
    fontFamily: "Open Sans",
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
});