import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

// const IP_ADDRESS = '192.168.1.146';

const CreateContact = ({ navigation }) => {
  const [neurodivergences, setNeurodivergences] = useState([]);
  const [selectedNeurodivergence, setSelectedNeurodivergence] = useState(null);
  const [contact, setContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birthday: '',
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch neurodivergence options from the server
    axios.get(`http://10.0.2.2:3000/api/neurodivergences`)
    .then(response => setNeurodivergences(response.data))
      .catch(error => console.error(error));
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  
    // Formatter la date en YYYY-MM-DD
    let formattedDate = currentDate.getFullYear().toString() + '-' +
                        (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                        currentDate.getDate().toString().padStart(2, '0');
  
    setContact({...contact, birthday: formattedDate});
  };


  const showDatePicker = () => {
    setShow(true);
  };

  const handleSubmit = () => {
    setError('');

    if (!contact.first_name || !contact.last_name) {
      setError('First name and last name are required.');
      return;
    }

    const payload = {
      contact: {
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || null,
        phone_number: contact.phone_number || null,
        birthday: contact.birthday || null
      },
      neurodivergence_id: selectedNeurodivergence
    };

    axios.post('http://10.0.2.2:3000/api/contacts', payload)
      .then(response => {
        console.log('Contact created:', response.data);
        Alert.alert('Success', 'Contact created successfully');
        navigation.goBack();
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
        } else {
          setError('An unexpected error occurred');
        }
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
      <View>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text>{contact.birthday || "Select Birthday"}</Text>
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
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={value => setSelectedNeurodivergence(value)}
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
