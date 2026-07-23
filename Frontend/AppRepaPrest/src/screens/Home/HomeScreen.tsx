// screens/HomeScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from './Home';
import AppHeader from '../../components/AppHeader';
import { api } from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { SoundService } from '../../services/SoundService';

type Props = BottomTabScreenProps<HomeTabParamList, 'Home'>;

const { height } = Dimensions.get('window');

// ============================================
// HTML DEL MAPA
// ============================================
const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #1C1C28; }
    .me-icon {
      background: #2196F3; width: 24px; height: 24px;
      border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 0 15px rgba(33,150,243,0.9);
    }
    .rider-icon {
      background: #FF6B35; width: 16px; height: 16px;
      border-radius: 50%; border: 2px solid #fff;
      box-shadow: 0 0 10px rgba(255,107,53,0.8);
    }
    .rider-icon.ocupado { background: #F59E0B; }
    .rider-icon.desconectado { background: #6B7280; opacity: 0.5; }
    .panic-icon {
      background: #FF0000; width: 35px; height: 35px;
      border-radius: 50%; border: 3px solid #fff;
      box-shadow: 0 0 30px rgba(255,0,0,0.9);
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    .leaflet-popup-content { min-width: 120px; color: #fff; }
    .leaflet-popup-content-wrapper { background: #1C1C28; border-radius: 10px; }
    .leaflet-popup-tip { background: #1C1C28; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: false }).setView([19.4326, -99.1332], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(map);

    const meIcon = L.divIcon({ className: '', html: '<div class="me-icon"></div>', iconSize: [24, 24] });
    const riderIcon = L.divIcon({ className: '', html: '<div class="rider-icon"></div>', iconSize: [16, 16] });
    const riderIconOcupado = L.divIcon({ className: '', html: '<div class="rider-icon ocupado"></div>', iconSize: [16, 16] });
    const riderIconDesconectado = L.divIcon({ className: '', html: '<div class="rider-icon desconectado"></div>', iconSize: [16, 16] });
    const panicIcon = L.divIcon({ className: '', html: '<div class="panic-icon"></div>', iconSize: [35, 35] });

    let meMarker = null;
    let riders = {};
    let panicMarkers = {};

    function updateMyLocation(lat, lng) {
      if (!meMarker) {
        meMarker = L.marker([lat, lng], { icon: meIcon }).addTo(map);
        map.setView([lat, lng], 15);
      } else {
        meMarker.setLatLng([lat, lng]);
      }
    }

    function updateRider(userId, userName, lat, lng, estado, enPanico, tipoEmergencia) {
      if (enPanico) {
        if (panicMarkers[userId]) {
          panicMarkers[userId].setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], { icon: panicIcon })
            .addTo(map)
            .bindPopup(\`
              <strong style="color: #FF0000;">🚨 ALERTA DE PÁNICO</strong><br/>
              <strong>\${userName}</strong><br/>
              Tipo: \${tipoEmergencia || 'No especificado'}<br/>
              <span style="color: #FF6B35;">¡Necesita ayuda urgente!</span>
            \`);
          panicMarkers[userId] = marker;
        }
        if (riders[userId]) {
          map.removeLayer(riders[userId]);
          delete riders[userId];
        }
        return;
      }

      if (panicMarkers[userId]) {
        map.removeLayer(panicMarkers[userId]);
        delete panicMarkers[userId];
      }

      let icon = riderIcon;
      if (estado === 'ocupado') icon = riderIconOcupado;
      if (estado === 'desconectado') icon = riderIconDesconectado;

      if (riders[userId]) {
        riders[userId].setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { icon: icon })
          .addTo(map)
          .bindPopup(\`
            <strong>\${userName}</strong><br/>
            Estado: \${estado || 'Desconocido'}
          \`);
        riders[userId] = marker;
      }
    }

    function removeRider(userId) {
      if (riders[userId]) {
        map.removeLayer(riders[userId]);
        delete riders[userId];
      }
      if (panicMarkers[userId]) {
        map.removeLayer(panicMarkers[userId]);
        delete panicMarkers[userId];
      }
    }

    function loadAllRiders(users) {
      users.forEach(user => {
        updateRider(user.id, user.nombre, user.latitud, user.longitud, user.estado, user.en_panico, user.tipo_emergencia);
      });
    }

    function clearAllRiders() {
      Object.keys(riders).forEach(key => {
        map.removeLayer(riders[key]);
        delete riders[key];
      });
      Object.keys(panicMarkers).forEach(key => {
        map.removeLayer(panicMarkers[key]);
        delete panicMarkers[key];
      });
    }

    window.updateMyLocation = updateMyLocation;
    window.updateRider = updateRider;
    window.removeRider = removeRider;
    window.loadAllRiders = loadAllRiders;
    window.clearAllRiders = clearAllRiders;
  </script>
</body>
</html>
`;

export default function HomeScreen({ route }: Props): JSX.Element {
  const { userName, userId } = route.params;

  // ========== ESTADOS ==========
  const [conectado, setConectado] = useState(false);
  const [sinPermiso, setSinPermiso] = useState(false);
  const [ubicacionLista, setUbicacionLista] = useState(false);
  const [panicoActivo, setPanicoActivo] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [alertasPanicoMostradas, setAlertasPanicoMostradas] = useState<Set<number>>(new Set()); 
  const [enviandoPanico, setEnviandoPanico] = useState(false);
  // ========== REFS ==========
  const webviewRef = useRef<WebView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRef = useRef<string | null>(null);

  // ========== OBTENER TOKEN ==========
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        tokenRef.current = token;
      } catch (error) {
        console.error('Error obteniendo token:', error);
      }
    };
    getToken();
  }, []);

  // ========== FUNCIONES API ==========

  const enviarUbicacion = useCallback(async (lat: number, lng: number) => {
    if (!tokenRef.current) {
      console.log('❌ No hay token');
      return;
    }
    try {
      console.log('📍 Enviando ubicación:', { lat, lng });
      console.log('🔑 Token:', tokenRef.current.substring(0, 20) + '...');
      
      const response = await api.post('/mapa/ubicacion', { 
        latitud: lat, 
        longitud: lng 
      });
      
      console.log('📦 Respuesta ubicación:', response.data);
      
      if (response.data.res) setUbicacionLista(true);
    } catch (error: any) {
      console.error('❌ Error enviando ubicación:', error?.response?.data || error.message);
    }
  }, []);

 const obtenerRepartidores = useCallback(async () => {
  if (!conectado) {
    console.log('⏸️ Usuario no conectado, omitiendo obtención de repartidores');
    return;
  }

  if (!tokenRef.current) {
    console.log('❌ No hay token');
    return;
  }
  
  try {
    const response = await api.get('/mapa/repartidores');
    
    if (response.data.res && webviewRef.current) {
      // ✅ Filtrar solo usuarios CONECTADOS (estado = 'disponible')
      const usuariosConectados = response.data.data.filter(
        (user: any) => user.estado === 'disponible'
      );
      
      const cantidad = usuariosConectados.length;
      console.log(`✅ Repartidores CONECTADOS encontrados: ${cantidad}`);
      
      // ✅ Si hay usuarios en pánico entre los conectados
      const usuariosEnPanico = usuariosConectados.filter((user: any) => user.en_panico === true);
      
      if (usuariosEnPanico.length > 0) {
        console.log('🚨 Usuarios en pánico:', usuariosEnPanico.length);
        
        usuariosEnPanico.forEach((user: any) => {
          if (!alertasPanicoMostradas.has(user.id)) {
            console.log(`🔔 Alarma de pánico para: ${user.nombre}`);
            setAlertasPanicoMostradas(prev => new Set(prev).add(user.id));
            SoundService.playAlarma();
            Vibration.vibrate([500, 200, 500, 200, 500, 200, 1000]);
            
            Alert.alert(
              '🚨 ALERTA DE PÁNICO',
              `${user.nombre} ha activado una alerta de pánico!\n\n📍 Ubicación: ${user.latitud}, ${user.longitud}\n🆘 Tipo: ${user.tipo_emergencia || 'No especificado'}`,
              [
                { 
                  text: 'VER EN MAPA', 
                  onPress: () => {
                    if (webviewRef.current) {
                      webviewRef.current.injectJavaScript(`
                        map.setView([${user.latitud}, ${user.longitud}], 15);
                        true;
                      `);
                    }
                  }
                },
                { 
                  text: 'OK', 
                  style: 'cancel'
                }
              ]
            );
          }
        });
      } else {
        setAlertasPanicoMostradas(new Set());
      }
      
      // ✅ Actualizar el mapa SOLO con usuarios conectados
      webviewRef.current.injectJavaScript(`
        window.clearAllRiders();
        window.loadAllRiders(${JSON.stringify(usuariosConectados)});
        true;
      `);
    }
  } catch (error: any) {
    console.error('Error:', error?.response?.data || error.message);
  }
}, [conectado, userId, userName, alertasPanicoMostradas]);

  const cambiarEstado = useCallback(async (estado: 'conectado' | 'desconectado') => {
    if (!tokenRef.current) return;
    try {
      const response = await api.post('/mapa/estado', { estado });
      return response.data;
    } catch (error: any) {
      console.error('Error cambiando estado:', error?.response?.data || error.message);
      throw error;
    }
  }, []);

  const togglePanicoAPI = useCallback(async (accion: 'activar' | 'desactivar', data?: any) => {
    if (!tokenRef.current) return;
    try {
      const response = await api.post('/mapa/panico', { accion, ...data });
      return response.data;
    } catch (error: any) {
      console.error('Error en pánico:', error?.response?.data || error.message);
      throw error;
    }
  }, []);

  // ========== INICIAR MONITOREO (SOLO UBICACIÓN) ==========
  const iniciarMonitoreo = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setSinPermiso(true);
      return;
    }
    setSinPermiso(false);

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      await enviarUbicacion(latitude, longitude);

      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          window.updateMyLocation(${latitude}, ${longitude});
          true;
        `);
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          const { latitude: lat, longitude: lng } = loc.coords;

          await enviarUbicacion(lat, lng);
          
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(`
              window.updateMyLocation(${lat}, ${lng});
              true;
            `);
          }
        } catch (error) {
          console.error('Error en intervalo de ubicación:', error);
        }
      }, 5000);

    } catch (error) {
      console.error('Error iniciando monitoreo:', error);
      Alert.alert('Error', 'No se pudo iniciar el monitoreo de ubicación');
    }
  }, [enviarUbicacion]);

  // ========== ACTUALIZAR REPARTIDORES CADA 3 SEGUNDOS ==========
  useEffect(() => {
    let repartidoresInterval: NodeJS.Timeout | null = null;
    
    if (conectado) {
      console.log('🔄 Iniciando actualización de repartidores cada 3s');
      obtenerRepartidores();
      
      repartidoresInterval = setInterval(() => {
        obtenerRepartidores();
      }, 3000);
    }
    
    return () => {
      if (repartidoresInterval) {
        clearInterval(repartidoresInterval);
        console.log('Deteniendo actualización de repartidores');
      }
    };
  }, [conectado, obtenerRepartidores]);

  // ========== CONECTAR/DESCONECTAR ==========
  const toggleConexion = async () => {
    setCargando(true);
    const nuevoEstado = conectado ? 'desconectado' : 'conectado';

    try {
      const data = await cambiarEstado(nuevoEstado);
      if (data?.res) {
        setConectado(!conectado);

        if (nuevoEstado === 'conectado') {
          await iniciarMonitoreo();
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setUbicacionLista(false);

          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(`
              window.clearAllRiders();
              true;
            `);
          }
        }
      } else {
        Alert.alert('Error', data?.msg || 'No se pudo cambiar el estado');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al cambiar el estado');
    }
    setCargando(false);
  };

  // ========== PÁNICO CON SONIDO Y VIBRACIÓN ==========
 const togglePanico = async () => {
  // ✅ Evitar múltiples envíos simultáneos
  if (enviandoPanico) {
    console.log('⏳ Ya hay una solicitud de pánico en proceso...');
    return;
  }

  if (!conectado) {
    Alert.alert('Error', 'Conéctate primero para usar el botón de pánico');
    return;
  }

  setCargando(true);
  setEnviandoPanico(true); // ✅ Bloquear nuevos envíos

  const accion = panicoActivo ? 'desactivar' : 'activar';

  try {
    let data: any = { accion };

    if (accion === 'activar') {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      data.latitud = location.coords.latitude;
      data.longitud = location.coords.longitude;
      data.tipo_emergencia = 'asaltado';

      // ✅ SUENA ALARMA PARA EL USUARIO QUE ACTIVA
      await SoundService.playAlarma();
      
      // ✅ VIBRACIÓN
      Vibration.vibrate([500, 200, 500, 200, 500, 200, 1000]);
      
      // ✅ MENSAJE DE CONFIRMACIÓN
      Alert.alert(
        '🚨 ALERTA DE PÁNICO ACTIVADA',
        'Se ha notificado a todos los repartidores cercanos.',
        [
          { 
            text: 'DESACTIVAR ALERTA', 
            onPress: async () => {
              await SoundService.stopAll();
              togglePanico();
            },
            style: 'destructive' 
          },
          { text: 'OK', style: 'cancel' }
        ]
      );
    }

    const response = await togglePanicoAPI(accion, accion === 'activar' ? data : undefined);

    if (response?.res) {
      setPanicoActivo(!panicoActivo);

      if (accion === 'desactivar') {
        // ✅ Sonido de confirmación al desactivar
        await SoundService.playConfirmacion();
        Alert.alert('Alerta desactivada', 'La alerta ha sido desactivada');
      }
    } else {
      Alert.alert('Error', response?.msg || 'No se pudo procesar la acción');
    }
  } catch (error) {
    Alert.alert('Error', 'Ocurrió un error al procesar el pánico');
  }
  
  setCargando(false);
  setEnviandoPanico(false); // ✅ Liberar bloqueo
};

  // ========== LIMPIEZA ==========
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      SoundService.stopAll();
    };
  }, []);

  // ========== RENDER ==========
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 49 : 0 }]}>
      <AppHeader userName={userName} subtitle="MONITOREO EN VIVO" />

      <View style={[styles.mapWrapper, Platform.OS === 'android' && { height: height * 0.48 }]}>
        <View style={styles.mapCard}>
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: mapHTML }}
            style={styles.webview}
            scrollEnabled={false}
            onLoadEnd={() => {
              if (conectado) iniciarMonitoreo();
            }}
          />

          {!ubicacionLista && !sinPermiso && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FF6B35" size="small" />
              <Text style={styles.loadingText}>Conectando GPS...</Text>
            </View>
          )}

          <View style={styles.mapBadge}>
            <Text style={styles.mapBadgeLabel}>👤 {userName}</Text>
          </View>

          <View style={[styles.statusBadge, conectado ? styles.statusConectado : styles.statusDesconectado]}>
            <View style={[styles.statusDot, conectado && styles.statusDotVerde]} />
            <Text style={styles.statusBadgeText}>{conectado ? 'En línea' : 'Desconectado'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomZone}>
        <Pressable
          style={[styles.mainButton, conectado && styles.mainButtonActive]}
          onPress={toggleConexion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={conectado ? '#4CAF50' : '#fff'} size="small" />
          ) : (
            <>
              <Ionicons name={conectado ? 'power' : 'flash'} size={22} color={conectado ? '#4CAF50' : '#fff'} />
              <Text style={[styles.mainButtonText, conectado && styles.mainButtonTextActive]}>
                {conectado ? 'DESCONECTAR' : 'CONECTAR'}
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[styles.panicoButton, panicoActivo && styles.panicoButtonActivo, !conectado && styles.panicoButtonDisabled]}
          onPress={togglePanico}
          disabled={cargando || !conectado}
        >
          <Ionicons name={panicoActivo ? 'alert-circle' : 'warning'} size={28} color="#000000" />
          <Text style={styles.panicoText}>{panicoActivo ? '¡PÁNICO ACTIVO!' : 'PELIGRO'}</Text>
          {panicoActivo && (
            <View style={styles.panicoIndicador}>
              <View style={styles.puntoParpadeante} />
            </View>
          )}
        </Pressable>

        {!conectado && (
          <Text style={styles.ayudaTexto}>Conéctate para ver a tu agrupacion buen camino!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F17' },
  mapWrapper: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
    borderRadius: 22,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' && { flex: 1 }),
  },
  mapCard: {
    height: '100%',
    backgroundColor: '#1C1C28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
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
  mapBadgeLabel: { fontSize: 12, color: '#fff', fontWeight: '600' },
  statusBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15,15,23,0.9)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusConectado: { borderColor: 'rgba(76,175,80,0.4)' },
  statusDesconectado: { borderColor: 'rgba(107,114,128,0.4)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B7280' },
  statusDotVerde: { backgroundColor: '#4CAF50' },
  statusBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  bottomZone: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
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
  panicoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
    opacity: 0.8,
  },
  panicoButtonActivo: {
    opacity: 1,
    backgroundColor: '#B91C1C',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  panicoButtonDisabled: { opacity: 0.4 },
  panicoText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  panicoIndicador: { position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -4 }] },
  puntoParpadeante: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  ayudaTexto: { textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
});