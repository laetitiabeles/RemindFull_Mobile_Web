import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import Logo from './assets/logo6.svg';
import Blob from './assets/blob.svg';
import Logo2 from './assets/images/logo2.png';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={Logo2} style={styles.ImageLogo} />
        {/* <Logo style={styles.logo}/> */}
        <Text style={styles.title}></Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.SignInbuttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: -30,
  },
  title: {
    fontSize: 20,
    color: '#1e1e1e',
    marginBottom: 50,
    // marginRight: 80,
    fontFamily: 'Inter-SemiBold',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 40,
  },
  signUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 120,
    borderRadius: 20,
    backgroundColor: '#031D44',
    // opacity: 0.8,
    marginBottom: 25,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#F5F5DC',
    // opacity: 0.8,
    borderWidth: 2,
    borderColor: '#031D44',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  SignInbuttonText: {
    color: '#031D44',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  ImageLogo: {
    width: 250,
    height: 250,
    marginBottom: -10,
  },
});

export default HomeScreen;
