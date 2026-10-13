import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../scripts/firebase";

function UserAuth({navigation}) {
    const [ login, setLogin ] = useState(true);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");

    async function AuthButtonPressed() {
        setErrorMessage("");

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        try {
            if (loginMode) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
                router.replace("/(tabs)/dashboard");
            } else {
                await createUserWithEmailAndPassword(auth, email.trim(), password);
                router.replace("../onboardingModal");
            }
        } catch (error) {
            console.log(error);
            
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setErrorMessage("Incorrect email or password.");
                    break;
                case 'auth/email-already-in-use':
                    setErrorMessage("An account with this email already exists.");
                    break;
                case 'auth/invalid-email':
                    setErrorMessage("Please enter a valid email address.");
                    break;
                case 'auth/weak-password':
                    setErrorMessage("Password must be at least 6 characters.");
                    break;
                default:
                    setErrorMessage("Authentication failed. Please try again.");
            }
        }
    }

    const toggleAuthMode = () => {
        setErrorMessage("");
        setLoginMode(prev => !prev);
    };

    return (
        <View style={styles.authContainer}>
            {errorMessage ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : null}
            <TextInput style={styles.textInputs} placeholder="email..."/>
            <TextInput style={styles.textInputs} placeholder="password..."/>
            <Pressable><Text>{login? "Sign Up?" : "Log In?"}</Text></Pressable>
            <Pressable onPress={Auth}>
                <Text>
                    {login? "Sign Up?" : "Login?"}
                </Text>
            </Pressable>
        </View>
    )
}

export default UserAuth;

const styles = StyleSheet.create({
    authContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "blue",
        padding: 35,
    },
    textInputs : {
        backgroundColor: "#fff", 
        borderRadius: 10, 
        padding: 13, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: "#BFDDD6"
    }
})