import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

function UserAuth({ navigation }) {
    const [ login, setLogin ] = useState(true);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

    async function AuthButtonPressed() {
        setErrorMessage("");

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        setIsLoading(true);

        try {
            if (login) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            } else {
                await createUserWithEmailAndPassword(auth, email.trim(), password);
            }
            // Navigate to main mapping screen on successful auth
            navigation.replace("Mapping");
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
        } finally {
            setIsLoading(false);
        }
    }

    const toggleAuthMode = () => {
        setErrorMessage("");
        setLogin(prev => !prev);
    };

    return (
        <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Watch Tower</Text>
            {errorMessage ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            ) : null}

            <TextInput 
                style={styles.textInputs} 
                onChangeText={t => setEmail(t)} 
                value={email}
                placeholder="email..."
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.textInputs} 
                onChangeText={t => setPassword(t)} 
                value={password}
                placeholder="password..."
                secureTextEntry
            />

            <Pressable style={styles.authChange} onPress={toggleAuthMode}>
                <Text style={styles.authChangeText}>{login ? "Sign Up?" : "Log In?"}</Text>
            </Pressable>

            <Pressable 
                style={styles.authButton} 
                onPress={AuthButtonPressed}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.authButtonText}>
                        {login ? "Login" : "Sign Up"}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

export default UserAuth;

const styles = StyleSheet.create({
    authContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F4F5F7",
        padding: 30,
    },
    authTitle: {
        textAlign: "center",
        fontSize: 25,
        fontFamily: "Open Sans",
        fontWeight: "700",
        marginBottom: 75
    },
    textInputs: {
        backgroundColor: "#fff", 
        borderRadius: 10, 
        padding: 13, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: "#BFDDD6"
    },
    errorBox: {
        backgroundColor: "#FFE199",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: "#1C1C1E",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 13,
    },
    authChange: {
        marginTop: 20,
        marginBottom: 35,
        height: 25,
        width: "auto"
    },
    authChangeText: {
        fontWeight: "900",
        fontSize: 16,
        marginLeft: 10,
        color: "#6798FC"
    },
    authButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#FF4C7A",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    authButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: "white"
    }
});