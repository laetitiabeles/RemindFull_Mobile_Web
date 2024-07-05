import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import BlueWave from './BlueWave';
import RFLogo from './assets/RFLogo2.svg';
import axios from 'axios';
import { useUser } from './UserContext';
import BASE_URL from './config';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        navigation.navigate('HomeAfterLogin');
      } else {
        Alert.alert('Error', 'Failed to log in');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Error', `Failed to log in: ${error.response.data.error}`);
      } else {
        Alert.alert('Error', 'Failed to log in');
      }
    }
  };

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <BlueWave />
      </View>
      <View style={styles.logoContainer}>
        <RFLogo width={240} height={260}/>
      </View>
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#FBFBF1"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#FBFBF1"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.noAccount}>Tu n'as pas encore de compte? Inscris toi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Même couleur que le SVG
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 200,
  },
  logoContainer: {
    position: 'absolute',
    marginTop: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#031D44',
    marginTop: 290,
    paddingBottom: 100,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimensions.get('window').height * 0.015,
    paddingHorizontal: Dimensions.get('window').width * 0.25,
    borderRadius: 20,
    backgroundColor: '#FBFBF1',
    marginTop: Dimensions.get('window').height * 0.06,
  },
  signInButtonText: {
    color: '#031D44',
    fontSize: Dimensions.get('window').width * 0.045,
    fontFamily: 'Inter-SemiBold',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '80%',
  },
  input: {
    width: '100%',
    marginBottom: Dimensions.get('window').height * 0.025,
    paddingVertical: Dimensions.get('window').height * 0.015,
    paddingHorizontal: Dimensions.get('window').width * 0.1,
    borderWidth: 1.7,
    borderColor: '#FBFBF1',
    borderRadius: 20,
    fontFamily: 'Inter-SemiBold',
    fontSize: Dimensions.get('window').width * 0.035,
    textAlign: 'center',
    color: '#FBFBF1',
  },
  signUpButton: {
    marginTop: Dimensions.get('window').height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAccount: {
    color: '#FBFBF1',
    fontSize: Dimensions.get('window').width * 0.035,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default HomeScreen;
