import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomePage } from './pages/HomePage';


const Tab = createMaterialTopTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    swipeEnabled: true,
                }}
            >
                <Tab.Screen name="Home" component={HomePage} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
