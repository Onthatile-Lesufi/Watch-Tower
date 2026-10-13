import { Pressable, StyleSheet } from "react-native";
import { View } from "react-native";

function History({navigation}) {
    return (
        <View style={styles.historyContainer}>
            <View>
                
            </View>

            <Pressable onPress={() => navigation.navigate("Mapping")}>
                <View></View>
            </Pressable>
        </View>
    )
}

export default History;

const styles = StyleSheet.create({
    historyContainer : {
        flex: 1
    }
})