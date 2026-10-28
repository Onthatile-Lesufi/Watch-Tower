import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Landing from './src/pages/landing';
import Mapping from './src/pages/mapping';
import UserAuth from './src/pages/userAuth';
import History from './src/pages/history';
import Onboarding from './src/pages/onboarding';
import Settings from './src/pages/settings'; // Added Settings import

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={Landing}/>
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="Mapping" component={Mapping}/>
            <Stack.Screen name="Auth" component={UserAuth}/>
            <Stack.Screen name="History" component={History}/>
            <Stack.Screen name="Settings" component={Settings}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});