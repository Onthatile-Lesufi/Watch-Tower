import { Text } from "react-native";
import { View, StyleSheet } from "react-native";

function Landing ({navigation}) {
    return (
        <View style={styles.landingContainer}>
            <Text>Watch Tower</Text>
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
    }
})