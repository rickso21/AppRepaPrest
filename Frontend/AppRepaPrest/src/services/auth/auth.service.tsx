import { api } from '../api';
import * as SecureStore from 'expo-secure-store';

const Storage = {
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);

    } catch (error) {

    }
  },
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {

        return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
    }
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  res: boolean;
  token: string;
  created_at: string;
  expired_at: string;
  msg: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      if (response.data.res === true && response.data.token) {        
        await Storage.setItem('userToken', response.data.token);
        await Storage.setItem('userData', JSON.stringify(response.data.user));
        await Storage.setItem('tokenExpiry', response.data.expired_at);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      await Storage.removeItem('userToken');
      await Storage.removeItem('userData');
      await Storage.removeItem('tokenExpiry');
    }
  },

  getToken: async (): Promise<string | null> => {
    return await Storage.getItem('userToken');
  },

  getUserData: async (): Promise<LoginResponse['user'] | null> => {
    try {
      const userData = await Storage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await Storage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};