import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Platform } from 'react-native';
import Talking from './assets/talking.svg';
import Arrow from './assets/arrow_left.svg';
import Background from './assets/background-signup.svg';
import axios from 'axios';
import BASE_URL from './config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  // Références pour les champs de texte
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setBirthday(currentDate);
  };

  const handleSignUp = async () => {
    setError('');

    try {
      const formattedBirthday = birthday ? format(birthday, 'yyyy-MM-dd') : null;

      const response = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        birthday: formattedBirthday,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('HomeAfterLogin');
      } else {
        Alert.alert('Error', 'Failed to register user');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register user');
    }
  };

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1, backgroundColor: '#FBFBF1' }} 
      contentContainerStyle={{ flexGrow: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <View style={styles.container}>
        <Background style={styles.background} />
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.arrowContainer}>
          <Arrow width={32} height={32} fill="#FBFBF1" />
        </TouchableOpacity>
        <Talking width={350} height={350} style={styles.talking} />
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#031D44"
          value={username}
          onChangeText={text => setUsername(text)}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#031D44"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          ref={emailRef}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#031D44"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          ref={passwordRef}
          returnKeyType="done"
        />
        <View style={styles.datePickerContainer}>
          <Text style={styles.textBirthday}>{birthday ? format(birthday, 'dd/MM/yyyy') : "Date de naissance :"}</Text>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            maximumDate={new Date()}
            style={styles.dateTimePicker}
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
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
    marginBottom: 50,
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
    left: 20,
    paddingTop: 50,
  },
  talking: {
    marginTop: -42,
    marginBottom: 50,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#031D44',
    borderRadius: 20,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    color: '#031D44',
    fontSize: 15,
    marginBottom: 20,
  },
  datePickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textBirthday: {
    color: '#031D44',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 10, // Add space between text and DateTimePicker
  },
  dateTimePicker: {
    width: '100%',
    height: 100,
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#031D44',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FBFBF1',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default SignUp;
