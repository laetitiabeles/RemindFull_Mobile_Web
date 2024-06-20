import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns'; // Importez la fonction de formatage de date depuis date-fns

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(null); // Utilisez null pour une date non définie
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

      const response = await axios.post('http://10.0.2.2:3000/auth/register', {
        username,
        email,
        password,
        birthday: formattedBirthday, // Envoyer la date au format correct au serveur
      });

      if (response.status === 201) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('SignIn'); // Rediriger vers l'écran de connexion après inscription
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
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <View>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text>{birthday ? format(birthday, 'dd/MM/yyyy') : "Birthday"}</Text>
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
      <Button title="S'inscrire" onPress={handleSignUp} />
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

export default SignUp;
