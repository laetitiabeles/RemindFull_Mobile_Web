import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      console.log('Attempting to log in with:', { username, password });
  
      const response = await axios.post('http://10.0.2.2:3000/auth/login', {
        username,
        password,
      });
  
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
  
      if (response.status === 200) {
        Alert.alert('Success', 'User logged in successfully');
        // Implémentez votre logique de gestion de session ou de navigation ici
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
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
});

export default SignIn;
