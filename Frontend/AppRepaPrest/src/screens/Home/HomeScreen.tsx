import React, { JSX, useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from './Home';
import AppHeader from '../../components/AppHeader';

type Props = BottomTabScreenProps<HomeTabParamList, 'Home'>;

const DEFAULT_LAT = 19.4326;
const DEFAULT_LNG = -99.1332;

const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #1C1C28; }
    .rider-icon {
      background: #FF6B35; width: 18px; height: 18px;
      border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 0 8px rgba(255,107,53,0.8);
    }
    .me-icon {
      background: #2196F3; width: 20px; height: 20px;
      border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 0 10px rgba(33,150,243,0.9);
    }
    .leaflet-control-attribution { font-size: 8px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: false })
      .setView([${DEFAULT_LAT}, ${DEFAULT_LNG}], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);

    const meIcon = L.divIcon({ className: '', html: '<div class="me-icon"></div>', iconSize: [20, 20] });
    const riderIcon = L.divIcon({ className: '', html: '<div class="rider-icon"></div>', iconSize: [18, 18] });

    let meMarker = null;
    let riders = [];
    let riderInterval = null;

    // Coloca tu marcador y genera los simulados alrededor.
    // Se llama en cuanto hay una ubicación, aunque sea aproximada.
    function startTracking(lat, lng) {
      if (!meMarker) {
        meMarker = L.marker([lat, lng], { icon: meIcon }).addTo(map);
        map.setView([lat, lng], 15);
      } else {
        meMarker.setLatLng([lat, lng]);
      }

      if (riders.length === 0) {
        for (let i = 0; i < 6; i++) {
          const rlat = lat + (Math.random() - 0.5) * 0.015;
          const rlng = lng + (Math.random() - 0.5) * 0.015;
          const marker = L.marker([rlat, rlng], { icon: riderIcon }).addTo(map);
          riders.push({ marker, lat: rlat, lng: rlng });
        }
        riderInterval = setInterval(() => {
          riders.forEach((r) => {
            r.lat += (Math.random() - 0.5) * 0.001;
            r.lng += (Math.random() - 0.5) * 0.001;
            r.marker.setLatLng([r.lat, r.lng]);
          });
        }, 2000);
      }
    }

    function updateMyLocation(lat, lng) {
      if (meMarker) {
        meMarker.setLatLng([lat, lng]);
        map.setView([lat, lng]);
      } else {
        startTracking(lat, lng);
      }
    }
  </script>
</body>
</html>
`;

export default function HomeScreen({ route }: Props): JSX.Element {
  const { userName } = route.params;

  const [conectado, setConectado] = useState<boolean>(false);
  const [sinPermiso, setSinPermiso] = useState<boolean>(false);
  const [ubicacionLista, setUbicacionLista] = useState<boolean>(false);

  const webviewRef = useRef<WebView>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const mapaListoRef = useRef<boolean>(false);
  const posPendienteRef = useRef<{ lat: number; lng: number } | null>(null);

  // Envía la posición al mapa. Si el mapa aún no cargó, la guarda para después.
  const enviarPosicion = (lat: number, lng: number) => {
    if (mapaListoRef.current) {
      webviewRef.current?.injectJavaScript(`startTracking(${lat}, ${lng}); true;`);
      setUbicacionLista(true);
    } else {
      posPendienteRef.current = { lat, lng };
    }
  };

  // Cuando el WebView termina de cargar, manda la posición que estuviera esperando
  const onMapaCargado = () => {
    mapaListoRef.current = true;
    if (posPendienteRef.current) {
      const { lat, lng } = posPendienteRef.current;
      webviewRef.current?.injectJavaScript(`startTracking(${lat}, ${lng}); true;`);
      setUbicacionLista(true);
      posPendienteRef.current = null;
    }
  };

  useEffect(() => {
    let cancelado = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setSinPermiso(true);
        return;
      }
      setSinPermiso(false);

      // PASO 1: última ubicación conocida (instantánea, sale de la caché del teléfono)
      try {
        const ultima = await Location.getLastKnownPositionAsync({});
        if (ultima && !cancelado) {
          enviarPosicion(ultima.coords.latitude, ultima.coords.longitude);
        }
      } catch (e) {
        // si no hay caché, seguimos al paso 2
      }

      // PASO 2: posición actual con precisión media (más rápida que High)
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelado) {
          enviarPosicion(pos.coords.latitude, pos.coords.longitude);
        }
      } catch (e) {
        // ignoramos: el watch de abajo seguirá intentando
      }

      if (cancelado) return;

      // PASO 3: seguimiento continuo con alta precisión
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          if (mapaListoRef.current) {
            webviewRef.current?.injectJavaScript(
              `updateMyLocation(${latitude}, ${longitude}); true;`
            );
            setUbicacionLista(true);
          } else {
            posPendienteRef.current = { lat: latitude, lng: longitude };
          }
        }
      );
    })();

    return () => {
      cancelado = true;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <AppHeader userName={userName} subtitle="INICIA TU JORNADA" />

      <View style={styles.mapCard}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          style={styles.webview}
          scrollEnabled={false}
          onLoadEnd={onMapaCargado}
        />

        {/* Indicador mientras se obtiene la ubicación */}
        {!ubicacionLista && !sinPermiso && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator color="#FF6B35" size="small" />
            <Text style={styles.loadingText}>Ubicando...</Text>
          </View>
        )}

        <View style={styles.mapBadge} pointerEvents="none">
          <Text style={styles.mapBadgeLabel}>Asignado a</Text>
          <Text style={styles.mapBadgeName}>{userName}</Text>
        </View>

        {sinPermiso && (
          <View style={styles.permWarning} pointerEvents="none">
            <Ionicons name="location-outline" size={14} color="#F59E0B" />
            <Text style={styles.permWarningText}>Sin permiso de ubicación</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomZone}>
        <View style={styles.statusCard}>
          <View
            style={[styles.statusDot, { backgroundColor: conectado ? '#4CAF50' : '#6B7280' }]}
          />
          <Text style={styles.statusText}>
            {conectado ? 'En línea · Listo para pedidos' : 'Desconectado'}
          </Text>
        </View>

        <Pressable
          style={[styles.mainButton, conectado && styles.mainButtonActive]}
          onPress={() => setConectado(!conectado)}
        >
          <Ionicons
            name={conectado ? 'power' : 'flash'}
            size={22}
            color={conectado ? '#4CAF50' : '#fff'}
          />
          <Text style={[styles.mainButtonText, conectado && styles.mainButtonTextActive]}>
            {conectado ? 'DESCONECTARSE' : 'CONECTARSE'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F17' },
  mapCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#1C1C28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  webview: { flex: 1, backgroundColor: '#1C1C28' },
  loadingOverlay: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15,15,23,0.92)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
  },
  loadingText: { fontSize: 12.5, color: '#fff', fontWeight: '600' },
  mapBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(15,15,23,0.9)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mapBadgeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 0.5 },
  mapBadgeName: { fontSize: 13.5, color: '#fff', fontWeight: '700', marginTop: 1 },
  permWarning: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,15,23,0.9)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
  },
  permWarningText: { fontSize: 11, color: '#F59E0B', fontWeight: '600' },
  bottomZone: { paddingHorizontal: 20, paddingBottom: 8 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 8,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
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
  mainButtonActive: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.5 },
  mainButtonTextActive: { color: '#4CAF50' },
});