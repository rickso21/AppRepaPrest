import React, { JSX } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../Home/Home';

type Props = BottomTabScreenProps<HomeTabParamList, 'Prestamos'>;

// Aunque la pestaña está bloqueada, la pantalla debe existir.
// Muestra un mensaje de "próximamente" por si en el futuro se habilita.
export default function PrestamosScreen(_props: Props): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="cash-outline" size={48} color="#FF6B35" />
        </View>
        <Text style={styles.title}>Préstamos</Text>
        <Text style={styles.subtitle}>Muy pronto podrás solicitar préstamos aquí</Text>
        <View style={styles.badge}>
          <Ionicons name="time-outline" size={14} color="#FF6B35" />
          <Text style={styles.badgeText}>PRÓXIMAMENTE</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F17' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderColor: 'rgba(255,107,53,0.35)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 24,
  },
  badgeText: { color: '#FF6B35', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
});