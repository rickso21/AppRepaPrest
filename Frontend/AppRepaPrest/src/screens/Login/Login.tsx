import React, { JSX, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');
const backgroundImage = require('../../../assets/images/photo-1519501025264-65ba15a82390.jpg');

// Definir el tipo de las props
type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = (): void => {
    // Validar campos
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar email (básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      Alert.alert('Error', 'Ingresa un correo válido o número de teléfono (10 dígitos)');
      return;
    }

    setLoading(true);
    
    // Simulación de login - Aquí iría tu lógica de autenticación
    setTimeout(() => {
      setLoading(false);
      // Configura el appnavigator cuando tengas los valores correctos.
      Alert.alert('Éxito', '¡Bienvenido!');
      navigation.navigate('Home', {
        userId: '12345',
        userName: 'Usuario Ejemplo'
      });
    }, 1500);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <View style={styles.container}>
              
              {/* Botón Volver */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>

              <View style={styles.header}>
                <View style={styles.logoCircle}>
                  <Image 
                    source={require('../../../assets/images/123.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Delivery Security</Text>
                <Text style={styles.subtitle}>Inicia Sesión</Text>
                <View style={styles.divider} />
              </View>

              {/* Formulario */}
              <View style={styles.formContainer}>
                {/* Campo Email/Teléfono */}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={22} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo o número de teléfono"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Campo Password */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Olvidé mi contraseña */}
                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={() => Alert.alert('Recuperar contraseña', 'Función en desarrollo')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Iniciar Sesión */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>
                        CARGANDO...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                      <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>

                {/* Texto de registro */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Registro', 'Función en desarrollo')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.registerLink}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.version}>v1.0.0</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: Platform.OS === 'ios' ? 40 : 30,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FF6B35',
  },
  logoImage: {
    width: '88%',
    height: '88%',
    borderRadius: 77,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 28 : 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 20,
    color: '#ffffff',
    marginTop: 8,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginTop: 12,
  },
  formContainer: {
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#1a1a2e',
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    letterSpacing: 1.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: 'bold',
  },
  version: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 10,
    letterSpacing: 1,
  },
});