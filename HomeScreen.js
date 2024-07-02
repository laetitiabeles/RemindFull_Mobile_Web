import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import BackgroundSVG from './assets/background.svg';
import RFLogo from './assets/RFLogo2.svg';
import axios from 'axios';
import { useUser } from './UserContext';

function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:3000/auth/login`, {
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

  return (
    <View style={styles.container}>
      <BackgroundSVG style={styles.background} />
      <RFLogo style={styles.logo} width={250} height={250} marginRight={50} />
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
    backgroundColor: '#FBFBF1',
  },
  background: {
    position: 'absolute',
    left: -22,
    right: 0,
    bottom: 0,
    top: 100,
    width: '150%',
    height: '100%',
  },
  logo: {
    position: 'absolute',
    marginTop: 85,
    marginLeft: 80,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 250,  // To make space for the logo
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 20,
    backgroundColor: '#FBFBF1',
    marginTop: 45,
  },
  signInButtonText: {
    color: '#031D44',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  buttonContainer: {
    color: '#FBFBF1',
    alignItems: 'center',
    textAlign: 'center',
    width: '80%',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderWidth: 1.7,
    borderColor: '#FBFBF1',
    borderRadius: 20,
    marginBottom: 20,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: '#FBFBF1',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAccount: {
    color: '#FBFBF1',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default HomeScreen;
