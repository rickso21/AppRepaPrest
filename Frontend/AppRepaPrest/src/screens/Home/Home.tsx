import React, { JSX } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Ionicons name="home" size={80} color="#FF6B35" />
        <Text style={styles.title}>¡Bienvenido a Delivery Security!</Text>
        <Text style={styles.subtitle}>Esta es tu pantalla principal</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});