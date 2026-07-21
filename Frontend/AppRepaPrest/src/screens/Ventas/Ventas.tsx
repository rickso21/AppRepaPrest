import React, { JSX } from 'react';
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

type Props = BottomTabScreenProps<HomeTabParamList, 'Ventas'>;

// Estados posibles (coinciden con tbl_status del scripts.sql)
type EstadoProducto = 'en_revision' | 'aceptado' | 'rechazado';

type Producto = {
  id: string;
  nombre: string;
  estado: EstadoProducto;
  monto?: number;
};

const PRODUCTOS: Producto[] = [
  { id: '1', nombre: 'Bicicleta de montaña', estado: 'aceptado', monto: 3500 },
  { id: '2', nombre: 'Teléfono celular', estado: 'en_revision' },
  { id: '3', nombre: 'Casco de moto', estado: 'rechazado' },
];

// El color y el icono salen del estado del producto
const ESTADO_CONFIG = {
  en_revision: { color: '#F59E0B', icon: 'time', label: 'En revisión' },
  aceptado: { color: '#4CAF50', icon: 'checkmark-circle', label: 'Aceptado' },
  rechazado: { color: '#EF4444', icon: 'close-circle', label: 'Rechazado' },
} as const;

export default function VentasScreen({ route }: Props): JSX.Element {
  const { userName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <AppHeader userName={userName} subtitle="EMPEÑOS Y VENTAS" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saldo disponible */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Disponible</Text>
          <Text style={styles.balanceValue}>$3,500</Text>
          <View style={styles.balanceFooter}>
            <Ionicons name="trending-up" size={14} color="#4CAF50" />
            <Text style={styles.balanceHint}>1 producto aceptado</Text>
          </View>
        </View>

        {/* Botón principal */}
        <Pressable style={styles.mainButton}>
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.mainButtonText}>EMPEÑAR PRODUCTO</Text>
        </Pressable>

        {/* Lista de productos */}
        <Text style={styles.sectionTitle}>Mis productos</Text>

        {PRODUCTOS.map((producto) => {
          const config = ESTADO_CONFIG[producto.estado];

          return (
            <Pressable key={producto.id} style={styles.productCard}>
              <View style={[styles.iconBox, { backgroundColor: config.color + '26' }]}>
                <Ionicons name={config.icon as any} size={22} color={config.color} />
              </View>

              <View style={styles.productContent}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                <View style={styles.productMeta}>
                  <Text style={[styles.productStatus, { color: config.color }]}>
                    {config.label}
                  </Text>
                  {producto.monto !== undefined && (
                    <Text style={styles.productAmount}>
                      · ${producto.monto.toLocaleString('es-MX')}
                    </Text>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.25)" />
            </Pressable>
          );
        })}
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
  balanceCard: {
    backgroundColor: '#1C1C28',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.25)',
    marginBottom: 18,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceValue: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FF6B35',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  balanceHint: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginTop: 30,
    marginBottom: 14,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C28',
    borderRadius: 18,
    padding: 14,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  productStatus: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  productAmount: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    marginLeft: 4,
  },
});