import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import Arrow from './assets/arrow_left.svg';
import GirlSignIn from './assets/Girl-Sign-in.svg';
import BASE_URL from './config';
import axios from 'axios';
import { useUser } from './UserContext';

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  const handleSignIn = async () => {
    try {
      console.log(`BASE_URL: ${BASE_URL}`);
      console.log('Attempting to log in with:', { username, password });
  
      const response = await axios.post(`http://10.0.2.2:3000/auth/login`, {
        username,
        password,
      });
  
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
  
      if (response.status === 200) {
        console.log('User data:', response.data.user);
        setUser(response.data.user);
        navigation.navigate('HomeAfterLogin');
      } else {
        console.log('Non-success status received:', response.status);
        Alert.alert('Error', 'Failed to log in');
      }
    } catch (error) {
      console.error('Error during login:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
  
      if (error.response && error.response.data) {
        Alert.alert('Error', `Failed to log in: ${error.response.data.error}`);
      } else {
        Alert.alert('Error', 'Failed to log in');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <GirlSignIn width={400} height={400} marginTop={-40} />
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        placeholderTextColor="#031D44"
        placeholderFontSize="15"
        placeholderFontFamily="Inter-SemiBold"
        value={username}
        onChangeText={text => setUsername(text)}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#031D44"
        placeholderFontSize="15"
        placeholderFontFamily="Inter-SemiBold"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signInButton}
      onPress={handleSignIn}
      >
      <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5DC',
    paddingTop: 50,
  },
  arrowContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.7,
    borderColor: '#031D44',
    borderRadius: 20,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    textColor: '#031D44',
    fontSize: 15,
    marginBottom: 20,
  },
  signInButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#031D44',
    marginBottom: 10,
    marginTop: 30,
    title: '#F5F5DC',
  },
  buttonText: {
    color: '#F5F5DC',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default SignIn;
