import React, { JSX, useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { height } = Dimensions.get('window');
const backgroundImage = require('../../../assets/images/photo-1519501025264-65ba15a82390.jpg');

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false); // true = ya se envió el correo
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  const onPressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  // Valida el correo y muestra el mensaje de error debajo del campo
  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('El correo electrónico no es válido');
      return false;
    }

    setError('');
    return true;
  };

  const handleSend = (): void => {
    if (!validate()) return;

    setLoading(true);

    // Simulación del envío - Aquí iría la llamada real al backend
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ResetPassword', { email: email.trim() });
    }, 1500);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <StatusBar style="light" />
      <View style={styles.scrim} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[styles.container, { opacity: fade, transform: [{ translateY: slide }] }]}
            >
              {/* Botón Volver */}
              <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
              </Pressable>

              {/* Contenido central: cambia según si ya se envió o no */}
              {!sent ? (
                <View style={styles.content}>
                  {/* Icono grande de contexto */}
                  <View style={styles.iconCircle}>
                    <Ionicons name="lock-open-outline" size={44} color="#FF6B35" />
                  </View>

                  <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
                  <Text style={styles.subtitle}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                  </Text>

                  {/* Campo de correo */}
                  <View style={styles.formContainer}>
                    <View
                      style={[
                        styles.inputContainer,
                        isFocused && styles.inputFocused,
                        !!error && styles.inputError,
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={error ? '#EF4444' : isFocused ? '#FF6B35' : 'rgba(255,255,255,0.5)'}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (error) setError(''); // limpia el error al escribir
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {/* Mensaje de error debajo del campo */}
                    {!!error && (
                      <View style={styles.errorRow}>
                        <Ionicons name="alert-circle" size={15} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    )}

                    {/* Botón Enviar */}
                    <Animated.View
                      style={{ transform: [{ scale: buttonScale }], width: '100%', marginTop: 18 }}
                    >
                      <Pressable
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={handleSend}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.buttonText, { marginLeft: 10, marginRight: 0 }]}>
                              Pensando...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.buttonText}>Recuperar Contraseña</Text>
                            <Ionicons name="send" size={20} color="#fff" />
                          </>
                        )}
                      </Pressable>
                    </Animated.View>
                  </View>
                </View>
              ) : (
                /* Estado de éxito: confirmación de envío */
                <View style={styles.content}>
                  <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
                    <Ionicons name="mail-open-outline" size={44} color="#4CAF50" />
                  </View>

                  <Text style={styles.title}>Revisa tu correo</Text>
                  <Text style={styles.subtitle}>
                    Enviamos un enlace de recuperación a{'\n'}
                    <Text style={styles.emailHighlight}>{email.trim()}</Text>
                  </Text>

                  <View style={styles.formContainer}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                      <Pressable
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                      >
                        <Text style={styles.buttonText}>VOLVER AL INICIO</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                      </Pressable>
                    </Animated.View>

                    {/* Reenviar */}
                    <Pressable
                      style={styles.resendContainer}
                      onPress={() => setSent(false)}
                      hitSlop={8}
                    >
                      <Text style={styles.resendText}>¿No lo recibiste? </Text>
                      <Text style={styles.resendLink}>Intentar de nuevo</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              <Text style={styles.version}>v1.0.0</Text>
            </Animated.View>
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
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 20, 0.55)',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
    paddingHorizontal: 28,
    paddingVertical: Platform.OS === 'ios' ? 50 : 36,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,107,53,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  iconCircleSuccess: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderColor: 'rgba(76,175,80,0.35)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  emailHighlight: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
    marginTop: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  inputFocused: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15.5,
    color: '#fff',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 10,
    letterSpacing: 2,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  resendText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  resendLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '700',
  },
  version: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1,
    width: '100%',
  },
});