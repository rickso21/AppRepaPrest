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

type Props = StackScreenProps<RootStackParamList, 'ResetPassword'>;

/* ------------------------------------------------------------------ */
/* Constantes de validación                                            */
/* ------------------------------------------------------------------ */

const MAX_PASSWORD = 64;

// Contraseñas comunes que se bloquean explícitamente
const COMMON_PASSWORDS = [
  'password',
  'contrasena',
  'contraseña',
  '12345678',
  'qwerty123',
  'admin123',
  'iloveyou',
];

export default function ResetPasswordScreen({ navigation, route }: Props): JSX.Element {
  // El correo llega desde la pantalla anterior (ForgotPassword)
  const { email } = route.params;

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false); // true = contraseña cambiada
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  /* ---------------------------------------------------------------- */
  /* Requisitos evaluados en vivo                                      */
  /* ---------------------------------------------------------------- */

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const noSpaces = password.length > 0 && !/\s/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // La parte local del correo no debe aparecer dentro de la contraseña
  const emailLocal = (email ?? '').split('@')[0].trim().toLowerCase();
  const containsEmail =
    emailLocal.length >= 3 && password.toLowerCase().includes(emailLocal);

  const isCommon = COMMON_PASSWORDS.some((c) => password.toLowerCase().includes(c));

  // No se permiten 3 o más caracteres idénticos seguidos (aaa, 111)
  const hasRepeats = /(.)\1{2,}/.test(password);

  // Ni secuencias obvias ascendentes/descendentes
  const hasSequence = /(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password);

  const allRulesMet =
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    noSpaces &&
    !containsEmail &&
    !isCommon &&
    !hasRepeats &&
    !hasSequence &&
    passwordsMatch;

  /* ---------------------------------------------------------------- */
  /* Sanitización y validación                                         */
  /* ---------------------------------------------------------------- */

  // Se bloquean espacios al escribir y se limita la longitud
  const sanitizePassword = (text: string): string =>
    text.replace(/\s/g, '').slice(0, MAX_PASSWORD);

  const validate = (): boolean => {
    if (!password || !confirmPassword) {
      setError('Completa ambos campos');
      return false;
    }
    if (!hasMinLength) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (password.length > MAX_PASSWORD) {
      setError(`La contraseña no puede exceder ${MAX_PASSWORD} caracteres`);
      return false;
    }
    if (!hasUpper) {
      setError('La contraseña debe incluir al menos una mayúscula');
      return false;
    }
    if (!hasLower) {
      setError('La contraseña debe incluir al menos una minúscula');
      return false;
    }
    if (!hasNumber) {
      setError('La contraseña debe incluir al menos un número');
      return false;
    }
    if (!hasSpecial) {
      setError('La contraseña debe incluir al menos un carácter especial');
      return false;
    }
    if (!noSpaces) {
      setError('La contraseña no puede contener espacios');
      return false;
    }
    if (containsEmail) {
      setError('La contraseña no debe contener tu correo');
      return false;
    }
    if (isCommon) {
      setError('La contraseña es demasiado común, elige otra');
      return false;
    }
    if (hasRepeats) {
      setError('Evita repetir el mismo carácter 3 veces seguidas');
      return false;
    }
    if (hasSequence) {
      setError('Evita secuencias obvias como 123 o abc');
      return false;
    }
    // La validación clave: que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    setError('');
    return true;
  };

  const handleReset = (): void => {
    if (!validate()) return;

    setLoading(true);

    // Simulación - Aquí iría la llamada real al backend
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  /* ---------------------------------------------------------------- */
  /* Fortaleza                                                         */
  /* ---------------------------------------------------------------- */

  const score = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthPct = password ? (score / 5) * 100 : 0;
  const strengthLabel = !password ? '' : score <= 2 ? 'Débil' : score <= 4 ? 'Media' : 'Fuerte';
  const strengthColor = score <= 2 ? '#EF4444' : score <= 4 ? '#FFB020' : '#4CAF50';

  /* ---------------------------------------------------------------- */
  /* Render de requisitos                                              */
  /* ---------------------------------------------------------------- */

  const renderRequirement = (met: boolean, label: string) => (
    <View style={styles.requirementRow} key={label}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={15}
        color={met ? '#4CAF50' : 'rgba(255,255,255,0.35)'}
      />
      <Text style={[styles.requirementText, met && styles.requirementMet]}>{label}</Text>
    </View>
  );

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
              {/* Botón Volver (solo antes de completar) */}
              {!done && (
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
              )}

              {!done ? (
                /* ---------- Formulario de nueva contraseña ---------- */
                <View style={styles.content}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="key-outline" size={44} color="#FF6B35" />
                  </View>

                  <Text style={styles.title}>Nueva contraseña</Text>
                  <Text style={styles.subtitle}>
                    Crea una contraseña segura para{'\n'}
                    <Text style={styles.emailHighlight}>{email}</Text>
                  </Text>

                  <View style={styles.formContainer}>
                    {/* Campo: nueva contraseña */}
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'password' && styles.inputFocused,
                        !!error && styles.inputError,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={
                          error
                            ? '#EF4444'
                            : focusedField === 'password'
                            ? '#FF6B35'
                            : 'rgba(255,255,255,0.5)'
                        }
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Nueva contraseña"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={password}
                        onChangeText={(t) => {
                          setPassword(sanitizePassword(t));
                          if (error) setError('');
                        }}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        secureTextEntry={!showPassword}
                        maxLength={MAX_PASSWORD}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        textContentType="none"
                      />
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                        hitSlop={10}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color="rgba(255,255,255,0.5)"
                        />
                      </Pressable>
                    </View>

                    {/* Barra de fortaleza: alto fijo, no desplaza el layout */}
                    <View style={styles.strengthBlock}>
                      <View style={styles.strengthTrack}>
                        <View
                          style={[
                            styles.strengthFill,
                            { width: `${strengthPct}%`, backgroundColor: strengthColor },
                          ]}
                        />
                      </View>
                      <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                        {strengthLabel}
                      </Text>
                    </View>

                    {/* Campo: confirmar contraseña */}
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'confirm' && styles.inputFocused,
                        !!error && styles.inputError,
                        // si ambas coinciden, se marca en verde
                        passwordsMatch && !error && styles.inputMatch,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={
                          error
                            ? '#EF4444'
                            : passwordsMatch
                            ? '#4CAF50'
                            : focusedField === 'confirm'
                            ? '#FF6B35'
                            : 'rgba(255,255,255,0.5)'
                        }
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={confirmPassword}
                        onChangeText={(t) => {
                          setConfirmPassword(sanitizePassword(t));
                          if (error) setError('');
                        }}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        secureTextEntry={!showConfirm}
                        maxLength={MAX_PASSWORD}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        textContentType="none"
                      />
                      <Pressable
                        onPress={() => setShowConfirm(!showConfirm)}
                        style={styles.eyeIcon}
                        hitSlop={10}
                      >
                        <Ionicons
                          name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color="rgba(255,255,255,0.5)"
                        />
                      </Pressable>
                    </View>

                    {/* Mensaje de error: el contenedor SIEMPRE existe con alto fijo,
                        así mostrarlo u ocultarlo no mueve el botón */}
                    <View style={styles.errorRow}>
                      {!!error && (
                        <>
                          <Ionicons name="alert-circle" size={15} color="#EF4444" />
                          <Text style={styles.errorText} numberOfLines={1}>
                            {error}
                          </Text>
                        </>
                      )}
                    </View>

                    {/* Requisitos en vivo: se van marcando conforme escribes */}
                    <View style={styles.requirementsBox}>
                      {renderRequirement(hasMinLength, 'Al menos 8 caracteres')}
                      {renderRequirement(hasUpper, 'Al menos una mayúscula')}
                      {renderRequirement(hasLower, 'Al menos una minúscula')}
                      {renderRequirement(hasNumber, 'Al menos un número')}
                      {renderRequirement(hasSpecial, 'Al menos un carácter especial')}
                      {renderRequirement(
                        password.length > 0 && !containsEmail && !isCommon && !hasRepeats && !hasSequence,
                        'Sin datos personales ni secuencias obvias'
                      )}
                      {renderRequirement(passwordsMatch, 'Las contraseñas coinciden')}
                    </View>

                    {/* Botón Guardar */}
                    <Animated.View
                      style={{ transform: [{ scale: buttonScale }], width: '100%', marginTop: 6 }}
                    >
                      <Pressable
                        style={[
                          styles.button,
                          (loading || !allRulesMet) && styles.disabledButton,
                        ]}
                        onPress={handleReset}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.buttonText, { marginLeft: 10, marginRight: 0 }]}>
                              GUARDANDO...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.buttonText}>GUARDAR CONTRASEÑA</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                          </>
                        )}
                      </Pressable>
                    </Animated.View>
                  </View>
                </View>
              ) : (
                /* ---------- Éxito: contraseña actualizada ---------- */
                <View style={styles.content}>
                  <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
                    <Ionicons name="shield-checkmark" size={44} color="#4CAF50" />
                  </View>

                  <Text style={styles.title}>¡Contraseña actualizada!</Text>
                  <Text style={styles.subtitle}>
                    Ya puedes iniciar sesión con tu nueva contraseña.
                  </Text>

                  <View style={styles.formContainer}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                      <Pressable
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                      >
                        <Text style={styles.buttonText}>IR AL INICIO DE SESIÓN</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                      </Pressable>
                    </Animated.View>
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
    marginBottom: 24,
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
    marginTop: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 10,
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
  // Cuando las contraseñas coinciden, el campo se marca en verde
  inputMatch: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76,175,80,0.08)',
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
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  // Alto fijo: la barra existe siempre, aunque no haya contraseña escrita
  strengthBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
    width: 48,
  },
  // Alto fijo: el espacio del error queda reservado desde el inicio,
  // por lo que aparecer/desaparecer no mueve el botón
  errorRow: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  // Caja con la lista de requisitos
  requirementsBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 18,
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    flex: 1,
  },
  requirementMet: {
    color: '#4CAF50',
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
    opacity: 0.55,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    letterSpacing: 1.5,
  },
  version: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1,
    width: '100%',
  },
});