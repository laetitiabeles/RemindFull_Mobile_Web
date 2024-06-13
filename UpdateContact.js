import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const UpdateContact = ({ route, navigation }) => {
  const { contact } = route.params;
  const [updatedContact, setUpdatedContact] = useState(contact);
  const [date, setDate] = useState(new Date(contact.birthday));
  const [show, setShow] = useState(false);
  const [neurodivergences, setNeurodivergences] = useState([]);
  const [selectedNeurodivergence, setSelectedNeurodivergence] = useState(contact.neurodivergence_id);

  useEffect(() => {
    axios.get('http://10.0.2.2:3000/api/neurodivergences')
      .then(response => setNeurodivergences(response.data))
      .catch(error => console.error('Failed to load neurodivergences:', error));
  }, []);

  const showDatePicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setUpdatedContact({...updatedContact, birthday: currentDate.toISOString().split('T')[0]});
  };

  const handleUpdate = () => {
    axios.put(`http://10.0.2.2:3000/api/contacts/${updatedContact._id}`, {...updatedContact, neurodivergence_id: selectedNeurodivergence})
      .then(() => {
        Alert.alert('Contact updated successfully');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Failed to update contact:', error);
        Alert.alert('Failed to update contact');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={updatedContact.first_name}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, first_name: text })}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={updatedContact.last_name}
        onChangeText={(text) => setUpdatedContact({ ...updatedContact, last_name: text })}
        placeholder="Last Name"
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
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text>{updatedContact.birthday || "Select Birthday"}</Text>
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
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={setSelectedNeurodivergence}
        style={styles.picker}
      >
        <Picker.Item label="Select Neurodivergence" value="" />
        {neurodivergences.map(nd => (
          <Picker.Item key={nd.id} label={nd.type} value={nd.id} />
        ))}
      </Picker>
      <Button title="Update Contact" onPress={handleUpdate} />
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
