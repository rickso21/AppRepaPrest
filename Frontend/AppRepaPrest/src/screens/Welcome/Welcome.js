import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const backgroundImage = require('../../../assets/images/photo-1519501025264-65ba15a82390.jpg');

export default function WelcomeScreen({ navigation }) {  //RECIBE navigation
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.overlay}>

            {/* Logo o Título */}
<View style={styles.header}>
  <View style={styles.logoCircle}>
    <Image 
      source={require('../../../assets/images/123.png')} // 👈 Ruta de tu imagen
      style={styles.logoImage}
      resizeMode="contain"
    />
  </View>
  <Text style={styles.title}>Delivery</Text>
  <Text style={styles.subtitle}>Herramientas para Repartidores</Text>
  <View style={styles.divider} />
</View>

            {/* Contenedor Blanco con Herramientas */}
            <View style={styles.whiteCard}>
              <View style={styles.featureItem}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                  <Ionicons name="locate" size={22} color="#4CAF50" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureText}>Monitoreo GPS en Tiempo Real</Text>
                  <Text style={styles.featureDesc}>Seguimiento a compañeros siempre</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
                  <Ionicons name="cash-outline" size={22} color="#F59E0B" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureText}>Prestamos al momento</Text>
                  <Text style={styles.featureDesc}>Solicita tu primer prestamo</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                  <Ionicons name="trending-up" size={22} color="#2196F3" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureText}>Market Place</Text>
                  <Text style={styles.featureDesc}>Ventas </Text>
                </View>
              </View>

              <View style={[styles.featureItem, styles.lastFeature]}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 107, 53, 0.15)' }]}>
                  <Ionicons name="people" size={22} color="#FF6B35" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureText}>Red Social</Text>
                  <Text style={styles.featureDesc}>Protección y comunidades</Text>
                </View>
              </View>
            </View>

            {/* Botón Empezar - AHORA NAVEGA A HOME */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}  // 👈 CAMBIADO
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>EMPEZAR</Text>
              <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.version}>Beta v1.0.0</Text>
          </View>
        </ScrollView>
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
    backgroundColor: 'transparent', 
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
    paddingHorizontal: 25,
    paddingVertical: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center', 
  },
  overlay: {
    flex: 1,
    width: '100%', 
    maxWidth: 500, 
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center', 
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 10 : 5,
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
  borderRadius: 77,  // 85 - 8 (por el borde)
},
  title: {
    fontSize: Platform.OS === 'ios' ? 30 : 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    letterSpacing: 1.5,
    textAlign: 'center', 
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
 subtitle: {
  fontSize: Platform.OS === 'ios' ? 13 : 14,
  color: '#ffffff', // Blanco puro
  marginTop: 4,
  letterSpacing: 1.5,
  fontWeight: '500', // Aumentado de 300 a 500
  textAlign: 'center',
  // Sombra más pronunciada
  textShadowColor: 'rgba(0,0,0,0.7)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
  // Opcional: fondo semitransparente detrás del texto
  backgroundColor: 'rgba(0,0,0,0.2)',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
},
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginTop: 12,
    alignSelf: 'center', 
  },
  whiteCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    width: '100%', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuresTitle: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    width: '100%',
  },
  lastFeature: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureText: {
    color: '#1a1a2e',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  featureDesc: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
    letterSpacing: 2.5,
  },
  version: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 11,
    marginVertical: 10,
    letterSpacing: 1,
    width: '100%',
  },
});