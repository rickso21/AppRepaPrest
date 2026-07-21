import React, { JSX } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import Home from './HomeScreen';
import Prestamos from '../Prestamos/Prestamos';
import Comunidad from '../Comunidad/Comunidad';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export type HomeTabParamList = {
  Home: { userId: string; userName: string };
  Prestamos: { userId: string; userName: string };
  Comunidad: { userId: string; userName: string };
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

// Pestañas que aún no están disponibles: se ven grises y no se puede entrar
const DISABLED_TABS = ['Prestamos', 'Comunidad'];

export default function HomeTabs({ route }: Props): JSX.Element {
  const { userId, userName } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route: tabRoute }) => {
        const isDisabled = DISABLED_TABS.includes(tabRoute.name);

        return {
          headerShown: false,
          tabBarActiveTintColor: '#FF6B35',
          // Si está deshabilitada, el color inactivo es más apagado
          tabBarInactiveTintColor: isDisabled ? '#3A3A45' : '#6B7280',
          tabBarStyle: {
            backgroundColor: '#16161F',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.07)',
            height: Platform.OS === 'ios' ? 88 : 66,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            elevation: 16,
          },
          tabBarLabelStyle: {
            fontSize: 11.5,
            fontWeight: '700',
            letterSpacing: 0.2,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: string;

            if (tabRoute.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (tabRoute.name === 'Prestamos') {
              iconName = focused ? 'cash' : 'cash-outline';
            } else {
              iconName = focused ? 'people' : 'people-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ userId, userName }}
        options={{ tabBarLabel: 'Home' }}
      />

      <Tab.Screen
        name="Prestamos"
        component={Prestamos}
        initialParams={{ userId, userName }}
        options={{ tabBarLabel: 'Préstamos' }}
        // Intercepta el toque: no deja entrar a la pestaña
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />

      <Tab.Screen
        name="Comunidad"
        component={Comunidad}
        initialParams={{ userId, userName }}
        options={{ tabBarLabel: 'Comunidad' }}
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />
    </Tab.Navigator>
  );
}