import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import BASE_URL from './config';

const UpdateContact = ({ route, navigation }) => {
  const { contact } = route.params;

  // Function to format the date as JJ-MM-AA
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Format the initial dates
  const initialBirthday = contact.birthday ? new Date(contact.birthday) : new Date();
  const initialLastContact = contact.last_contact ? new Date(contact.last_contact) : new Date();

  const [updatedContact, setUpdatedContact] = useState({
    ...contact,
    birthday: formatDate(initialBirthday),
    last_contact: formatDate(initialLastContact),
  });
  const [birthdayDate, setBirthdayDate] = useState(initialBirthday);
  const [lastContactDate, setLastContactDate] = useState(initialLastContact);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showLastContactPicker, setShowLastContactPicker] = useState(false);
  const [neurodivergences, setNeurodivergences] = useState([]);
  const [selectedNeurodivergence, setSelectedNeurodivergence] = useState(contact.neurodivergence_id);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/neurodivergences`)
      .then(response => setNeurodivergences(response.data))
      .catch(error => console.error('Failed to load neurodivergences:', error));
  }, []);

  const showBirthdayDatePicker = () => {
    setShowBirthdayPicker(true);
  };

  const showLastContactDatePicker = () => {
    setShowLastContactPicker(true);
  };

  const onBirthdayChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdayDate;
    setShowBirthdayPicker(false);
    setBirthdayDate(currentDate);
    setUpdatedContact({...updatedContact, birthday: formatDate(currentDate)});
  };

  const onLastContactChange = (event, selectedDate) => {
    const currentDate = selectedDate || lastContactDate;
    setShowLastContactPicker(false);
    setLastContactDate(currentDate);
    setUpdatedContact({...updatedContact, last_contact: formatDate(currentDate)});
  };

  const handleUpdate = () => {
    const updatedContactWithISO = {
      ...updatedContact,
      birthday: new Date(birthdayDate.getTime() - birthdayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0],
      last_contact: new Date(lastContactDate.getTime() - lastContactDate.getTimezoneOffset() * 60000).toISOString().split('T')[0],
    };

    axios.put(`${BASE_URL}/api/contacts/${updatedContact._id}`, {...updatedContactWithISO, neurodivergence_id: selectedNeurodivergence})
      .then(() => {
        Alert.alert('Contact modifié avec succès');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Erreur lors de la modification:', error);
        Alert.alert('Erreur, impossible de modifier le contact');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={updatedContact.first_name}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, first_name: text })}
        placeholder="Prénom"
      />
      <TextInput
        style={styles.input}
        value={updatedContact.last_name}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, last_name: text })}
        placeholder="Nom"
      />
      <TextInput
        style={styles.input}
        value={updatedContact.email}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, email: text })}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={updatedContact.phone_number}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, phone_number: text })}
        placeholder="Téléphone"
        keyboardType="phone-pad"
      />
      <TouchableOpacity onPress={showBirthdayDatePicker} style={styles.input}>
        <Text>{updatedContact.birthday || "Anniversaire"}</Text>
      </TouchableOpacity>
      {showBirthdayPicker && (
        <DateTimePicker
          value={birthdayDate}
          mode="date"
          onChange={onBirthdayChange}
          maximumDate={new Date()}  // Optional: Prevent future dates
        />
      )}
      <TouchableOpacity onPress={showLastContactDatePicker} style={styles.input}>
        <Text>{updatedContact.last_contact || "Dernier contact"}</Text>
      </TouchableOpacity>
      {showLastContactPicker && (
        <DateTimePicker
          value={lastContactDate}
          mode="date"
          display="default"
          onChange={onLastContactChange}
          maximumDate={new Date()}  // Optional: Prevent future dates
        />
      )}
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={setSelectedNeurodivergence}
        style={styles.picker}
      >
        <Picker.Item label="Neurodivergence" value="" />
        {neurodivergences.map(nd => (
          <Picker.Item key={nd.id} label={nd.type} value={nd.id} />
        ))}
      </Picker>
      <Button title="Modifier le contact" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    padding: 10
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  }
});

export default UpdateContact;
