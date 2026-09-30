import { StyleSheet, Text, Pressable, View } from "react-native";
import MapView from "react-native-maps";

function Mapping({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Pressable>
                    <Text></Text>
                </Pressable>
            </View>
            <MapView 
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    )
}

export default Mapping;

const styles = StyleSheet.create({
    container: {   
        flex: 1
    },
    overlay: {
        flex: 1,
        position: "absolute"
    },
    map: {
        width: '100%',
        height: '100%',
        position: "relative"
    },
})