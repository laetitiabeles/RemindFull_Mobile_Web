import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import BASE_URL from './config';
import Arrow from './assets/arrow_left.svg';
import { EventRegister } from 'react-native-event-listeners'; // Importer l'EventEmitter

const UpdateContact = ({ route, navigation }) => {
  const { contact } = route.params; // Supprimer onUpdate

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
        EventRegister.emit('contactUpdated', updatedContactWithISO); // Émettre l'événement de mise à jour
        navigation.goBack();
      })
      .catch(error => {
        console.error('Erreur lors de la modification:', error);
        Alert.alert('Erreur, impossible de modifier le contact');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Modifier le contact</Text>
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
      <View style={styles.datePickerContainer}>
        <Text style={styles.inputLabel}>Date de naissance :</Text>
        <DateTimePicker
          value={birthdayDate}
          mode="date"
          display="default"
          onChange={onBirthdayChange}
          maximumDate={new Date()} // Prevent future dates
          style={styles.dateTimePicker}
        />
      </View>
      <View style={styles.datePickerContainer}>
        <Text style={styles.inputLabel}>Date de dernier contact :</Text>
        <DateTimePicker
          value={lastContactDate}
          mode="date"
          display="default"
          onChange={onLastContactChange}
          maximumDate={new Date()} // Prevent future dates
          style={styles.dateTimePicker}
        />
      </View>
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
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdate}
      >
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 120,
  },
  arrowContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    color: '#031D44',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderWidth: 1.7,
    borderColor: '#031D44',
    borderRadius: 20,
    marginBottom: 20,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: '#031D44',
  },
  picker: {
    width: '100%',
    height: 30,
  },
  buttonContainer: {
    marginTop: 150,
  },
  updateButton: {
    backgroundColor: '#031D44',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 16,
  },
});

export default UpdateContact;
