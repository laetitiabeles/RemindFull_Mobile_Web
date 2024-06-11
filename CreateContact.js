import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';
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
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch neurodivergence options from the server
    axios.get('http://localhost:3000/api/neurodivergences')
      .then(response => setNeurodivergences(response.data))
      .catch(error => console.error(error));
  }, []);

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

    axios.post('http://localhost:3000/api/contacts', payload)
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
      <TextInput
        style={styles.input}
        placeholder="Birthday"
        onChangeText={text => setContact({ ...contact, birthday: text })}
      />
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
