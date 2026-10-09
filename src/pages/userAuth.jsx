import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";

function UserAuth({navigation}) {
    return (
        <View>
            <TextInput/>
            <TextInput/>
        </View>
    )
}

export default UserAuth;

const styles = StyleSheet.create({
    textInputs : {
        
    }
})