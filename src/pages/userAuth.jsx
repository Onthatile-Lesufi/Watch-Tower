import { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Switch, Image } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

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

function UserAuth({ navigation }) {
    const [ login, setLogin ] = useState(true);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ stayLoggedIn, setStayLoggedIn ] = useState(true);
    const [ loginCheck, setLoginCheck ] = useState(true);

    // Prevents onAuthStateChanged from overriding onboarding navigation during signup
    const isSigningUpRef = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (!isSigningUpRef.current) {
                    navigation.replace("Mapping");
                }
            } else {
                setLoginCheck(false);
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    async function AuthButtonPressed() {
        setErrorMessage("");

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        setIsLoading(true);

        try {
            if (!stayLoggedIn) {
                await setPersistence(auth, inMemoryPersistence);
            }

            if (login) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
                navigation.replace("Mapping");
            } else {
                isSigningUpRef.current = true;
                await createUserWithEmailAndPassword(auth, email.trim(), password);
                navigation.replace("Onboarding");
            }
        } catch (error) {
            console.log(error);
            isSigningUpRef.current = false;
            
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

    if (loginCheck) {
        return (
            <View style={styles.authContainer}>
                <ActivityIndicator size="large" color={COLORS.pinkCTA}/>
            </View>
        );
    }

    return (
        <View style={styles.authContainer}>
            <View style={styles.authHeader}>
                <Image style={styles.logo} source={require('../../assets/icons/Icon.png')}/>
                <Text style={styles.authTitle}>Watch Tower</Text>
            </View>

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

            <View style={styles.stayContainer}>
                <Text style={styles.stayText}>Stay Logged In?</Text>
                <Switch 
                    trackColor={{ false: COLORS.borderGray, true: COLORS.ecoGreen }}
                    thumbColor={stayLoggedIn ? COLORS.blue : "#f4f3f4"}
                    value={stayLoggedIn} 
                    onValueChange={val => setStayLoggedIn(val)}
                />
            </View>

            <Pressable 
                style={styles.authButton} 
                onPress={AuthButtonPressed}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
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
        backgroundColor: COLORS.lightGray,
        padding: 30,
    },
    authHeader: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 35,
        gap: 12,
    },
    authTitle: {
        textAlign: "center",
        fontSize: 26,
        fontFamily: "Open Sans",
        fontWeight: "700",
        color: COLORS.darkText,
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: "contain",
    },
    textInputs: {
        backgroundColor: COLORS.white, 
        borderRadius: 10, 
        padding: 13, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: "#BFDDD6",
        fontFamily: "Open Sans",
        fontSize: 15,
        color: COLORS.darkText,
    },
    errorBox: {
        backgroundColor: COLORS.yellow,
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: COLORS.darkText,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 13,
        fontFamily: "Open Sans",
    },
    authChange: {
        marginTop: 10,
        marginBottom: 20,
        height: 25,
    },
    authChangeText: {
        fontWeight: "900",
        fontSize: 16,
        marginLeft: 4,
        color: COLORS.blue,
        fontFamily: "Open Sans",
    },
    stayContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        paddingHorizontal: 4,
    },
    stayText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.darkText,
        fontFamily: "Open Sans",
    },
    authButton: {
        width: "100%",
        height: 50,
        backgroundColor: COLORS.pinkCTA,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    authButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: COLORS.white,
        fontFamily: "Open Sans",
    }
});