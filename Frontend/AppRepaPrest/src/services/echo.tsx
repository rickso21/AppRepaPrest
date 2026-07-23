

/*
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/ApiConfig';

// ✅ IMPORTANTE: Pusher debe estar en el objeto global para React Native
// @ts-ignore
window.Pusher = Pusher;

let echoInstance: any = null;

export const initEcho = async (): Promise<any> => {
  try {
    // Si ya existe una instancia, devolverla
    if (echoInstance) {
      return echoInstance;
    }

    // Obtener token de autenticación
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      console.warn('⚠️ No hay token para WebSocket');
      return null;
    }

    // ✅ Configuración para Laravel Reverb
    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: 'local', // REVERB_APP_KEY
      cluster: 'mt1',
      encrypted: false,
      host: '192.168.1.17', // ⚠️ Tu IP
      port: 8081, // ⚠️ Puerto de Reverb
      scheme: 'http',
      wsHost: '192.168.1.17',
      wsPort: 8081,
      wssPort: 8081,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${API_CONFIG.baseURL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    console.log('✅ Echo inicializado con Reverb');
    return echoInstance;

  } catch (error) {
    console.error('❌ Error inicializando Echo:', error);
    return null;
  }
};

export const disconnectEcho = () => {
  if (echoInstance) {
    try {
      echoInstance.disconnect();
    } catch (e) {
      console.warn('Error desconectando Echo:', e);
    }
    echoInstance = null;
    console.log('🔌 Echo desconectado');
  }
};

export const getEcho = () => {
  return echoInstance;
};
*/