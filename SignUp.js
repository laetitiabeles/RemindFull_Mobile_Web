import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text, Platform } from 'react-native';
import Talking from './assets/talking.svg';
import Arrow from './assets/arrow_left.svg';
import Background from './assets/background-signup.svg';
import axios from 'axios';
import BASE_URL from './config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [date, setDate] = useState(new Date()); // État pour la date sélectionnée
  const [show, setShow] = useState(false); // État pour afficher/masquer le sélecteur de date
  const [error, setError] = useState('');

  // Fonction pour afficher le sélecteur de date
  const showDatePicker = () => {
    setShow(true);
  };

  // Fonction pour gérer le changement de date sélectionnée
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setBirthday(currentDate); // Mettre à jour l'état birthday avec la date sélectionnée
  };

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleSignUp = async () => {
    setError('');

    try {
      // Formatter la date au format YYYY-MM-DD pour l'envoyer au serveur
      const formattedBirthday = birthday ? format(birthday, 'yyyy-MM-dd') : null;

      const response = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        birthday: formattedBirthday, // Envoyer la date au format correct au serveur
      });

      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('HomeAfterLogin'); // Rediriger vers l'écran de connexion après inscription
      } else {
        Alert.alert('Error', 'Failed to register user');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register user');
    }
  };

  return (
    <View style={styles.container}>
      <Background style={styles.background} />
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#FBFBF1"/>
      </TouchableOpacity>
      <Talking width={350} height={350} marginTop={-50} />
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        placeholderTextColor="#031D44"
        placeholderFontSize="15"
        placeholderFontFamily="Inter-SemiBold"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#031D44"
        placeholderFontSize="15"
        placeholderFontFamily="Inter-SemiBold"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
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
      <View>
        <TouchableOpacity onPress={showDatePicker} style={styles.birthdayInput}>
          <Text style={styles.textBirthday}>{birthday ? format(birthday, 'dd/MM/yyyy') : "Date de naissance"}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            maximumDate={new Date()}  // Optional: Prevent future dates
          />
        )}
      </View>
      <TouchableOpacity style={styles.signUpButton}
      onPress={handleSignUp}
      >
      <Text style={styles.buttonText}>S'inscrire</Text>
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
    backgroundColor: '#FBFBF1',
    paddingTop: 50,
  },
  background: {
    position: 'absolute',
    top: -200,
    left: -20,
    right: 0,
    bottom: 0,
    width: '120%',
    height: '100%',
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
  birthdayInput: {
    width: '120%',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 107,
    borderWidth: 1.7,
    borderColor: '#031D44',
    borderRadius: 20,
  },
  textBirthday: {
    color: '#031D44',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'left',
    jusrtifyContent: 'left',
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#031D44',
    marginBottom: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#FBFBF1',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default SignUp;
