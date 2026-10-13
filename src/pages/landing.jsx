import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";

function Landing ({navigation}) {
    useEffect(() => {
        setTimeout(() => {

        }, 5000);
        navigation.navigate("Auth");
    },[])

    return (
        <View style={styles.landingContainer}>
            <Text style={styles.titleText}>Watch Tower</Text>
            <ActivityIndicator size={"large"} color={"#6798FC"}/>
        </View>
    )
}

export default Landing;

const styles = StyleSheet.create({
    landingContainer : {
        flex: 1,
        backgroundColor: '#C1EABB',
        alignItems:"center",
        justifyContent: "center"
    },
    titleText : {

    }
})