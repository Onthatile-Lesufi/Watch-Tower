import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Landing from './src/pages/landing';
import Mapping from './src/pages/mapping';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Mapping" component={Mapping}/>
            <Stack.Screen name="Landing" component={Landing}/>
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
