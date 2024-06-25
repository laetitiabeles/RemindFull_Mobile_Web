import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BASE_URL from './config';
import axios from 'axios';

const CreateContact = ({ navigation }) => {
  const [neurodivergences, setNeurodivergences] = useState([]);
  const [selectedNeurodivergence, setSelectedNeurodivergence] = useState(null);
  const [contact, setContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birthday: '',
    last_contact: '',
  });
  const [date, setDate] = useState(new Date());
  const [lastContactDate, setLastContactDate] = useState(new Date());
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showLastContactPicker, setShowLastContactPicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://${BASE_URL}/api/neurodivergences`)
      .then(response => setNeurodivergences(response.data))
      .catch(error => console.error(error));
  }, []);

  const onDateChange = (field, event, selectedDate) => {
    const currentDate = selectedDate || (field === 'birthday' ? date : lastContactDate);
    if (field === 'birthday') {
      setShowBirthdayPicker(false);
      setDate(currentDate);
    } else {
      setShowLastContactPicker(false);
      setLastContactDate(currentDate);
    }

    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    setContact({...contact, [field]: formattedDate});
  };

  const handleSubmit = () => {
    setError('');
  
    if (!contact.first_name || !contact.last_name) {
      setError('First name and last name are required.');
      return;
    }
  
    const payload = { 
      contact: { 
        ...contact, 
        neurodivergences: selectedNeurodivergence ? [selectedNeurodivergence] : []
      } 
    };
  
    console.log('Payload:', payload); // Log the payload to verify data
  
    axios.post(`http://${BASE_URL}/api/contacts`, payload)
      .then(response => {
        Alert.alert('Success', 'Contact created successfully');
        navigation.goBack();
      })
      .catch(error => {
        setError(error.response && error.response.data ? error.response.data.error : 'An unexpected error occurred');
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Contact</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={text => setContact({ ...contact, first_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={text => setContact({ ...contact, last_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={text => setContact({ ...contact, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={text => setContact({ ...contact, phone_number: text })}
      />
      <TouchableOpacity onPress={() => setShowBirthdayPicker(true)} style={styles.input}>
        <Text>{contact.birthday || "Select Birthday"}</Text>
      </TouchableOpacity>
      {showBirthdayPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange('birthday', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
        />
      )}
      <TouchableOpacity onPress={() => setShowLastContactPicker(true)} style={styles.input}>
        <Text>{contact.last_contact || "Select Last Contact Date"}</Text>
      </TouchableOpacity>
      {showLastContactPicker && (
        <DateTimePicker
          value={lastContactDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange('last_contact', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
        />
      )}
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={itemValue => setSelectedNeurodivergence(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Neurodivergence" value="" />
        {neurodivergences.map(nd => (
          <Picker.Item key={nd.id} label={nd.type} value={nd.id} />
        ))}
      </Picker>
      <Button title="Create Contact" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CreateContact;
