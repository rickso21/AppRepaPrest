import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../screens/Welcome/Welcome';
import Login from '../screens/Login/Login';
import Home from '../screens/Home/Home';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
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