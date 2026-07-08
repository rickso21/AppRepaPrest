// src/navigation/AppNavigator.tsx
import React, { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// IMPORTANTE: Verifica que estas rutas sean correctas
import Welcome from '../screens/Welcome/Welcome';
import Login from '../screens/Login/Login';
import Home from '../screens/Home/Home';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}