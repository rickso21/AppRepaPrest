import React, { JSX, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../Home/Home';
import AppHeader from '../../components/AppHeader';

type Props = BottomTabScreenProps<HomeTabParamList, 'Monitoreo'>;

// Accesos rápidos en cuadrícula, como en la referencia
const ACCESOS = [
  { icon: 'map', label: 'MAPA', color: '#FF6B35' },
  { icon: 'people', label: 'COMPAÑEROS', color: '#2196F3' },
  { icon: 'shield-checkmark', label: 'SEGURIDAD', color: '#4CAF50' },
  { icon: 'alert-circle', label: 'ALERTAS', color: '#F59E0B' },
] as const;

export default function MonitoreoScreen({ route }: Props): JSX.Element {
  const { userName } = route.params;
  const [gpsActivo, setGpsActivo] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <AppHeader userName={userName} subtitle="MONITOREO EN VIVO" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de estado del GPS */}
        <View style={styles.gpsCard}>
          <View style={styles.gpsRow}>
            <View
              style={[
                styles.gpsIconBox,
                gpsActivo && { backgroundColor: 'rgba(76,175,80,0.15)' },
              ]}
            >
              <Ionicons
                name={gpsActivo ? 'radio' : 'radio-outline'}
                size={24}
                color={gpsActivo ? '#4CAF50' : '#6B7280'}
              />
            </View>

            <View style={styles.gpsContent}>
              <Text style={styles.gpsTitle}>
                {gpsActivo ? 'GPS activo' : 'GPS inactivo'}
              </Text>
              <Text style={styles.gpsDesc}>
                {gpsActivo
                  ? 'Compartiendo tu ubicación'
                  : 'Actívalo para compartir ubicación'}
              </Text>
            </View>

            {/* Interruptor simple */}
            <Pressable
              style={[styles.toggle, gpsActivo && styles.toggleOn]}
              onPress={() => setGpsActivo(!gpsActivo)}
            >
              <View style={[styles.toggleKnob, gpsActivo && styles.toggleKnobOn]} />
            </Pressable>
          </View>
        </View>

        {/* Cuadrícula de accesos, estilo referencia */}
        <View style={styles.grid}>
          {ACCESOS.map((a) => (
            <Pressable key={a.label} style={styles.gridCard}>
              <View style={[styles.gridIconBox, { backgroundColor: a.color + '26' }]}>
                <Ionicons name={a.icon as any} size={28} color={a.color} />
              </View>
              <Text style={styles.gridLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Métricas */}
        <Text style={styles.sectionTitle}>Estado de la red</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Ionicons name="people" size={20} color="#2196F3" />
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>En línea</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.metricLabel}>Alertas</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F17',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  gpsCard: {
    backgroundColor: '#1C1C28',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 22,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  gpsContent: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#fff',
  },
  gpsDesc: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: 'rgba(76,175,80,0.35)',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6B7280',
  },
  toggleKnobOn: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  // Cuadrícula 2x2
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: '#1C1C28',
    borderRadius: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  gridIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginTop: 28,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 11,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1C1C28',
    borderRadius: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 21,
    fontWeight: '800',
    color: '#fff',
    marginTop: 9,
  },
  metricLabel: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
    fontWeight: '600',
  },
});