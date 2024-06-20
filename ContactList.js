import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { format } from 'date-fns';

const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = () => {
    axios.get('http://10.0.2.2:3000/api/contacts')
      .then(response => {
        console.log('Data received:', response.data);
        setContacts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
        if (error.response) {
          console.error('Error details:', error.response.data);
        } else {
          console.error('Error with no response data');
        }
        Alert.alert('Error', 'Failed to load contacts');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
        fetchContacts();
    }, [])
);

  const formattedDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy');
  };

  const handleDelete = (contactId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => deleteContact(contactId)
        }
      ]
    );
  };

  const deleteContact = (contactId) => {
    axios.delete(`http://10.0.2.2:3000/api/contacts/${contactId}`)
      .then(response => {
        Alert.alert('Success', 'Contact deleted successfully');
        setContacts(contacts.filter(contact => contact._id !== contactId));
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
        Alert.alert('Error', 'Failed to delete the contact');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <Button
        title="Create Contact"
        onPress={() => navigation.navigate('CreateContact')} // Assurez-vous que 'CreateContact' est le bon nom de la route
        color="#007BFF" // Couleur du bouton, ici bleu
      />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>Name: {item.first_name} {item.last_name}</Text>
            <Text style={styles.contactText}>Email: {item.email}</Text>
            <Text style={styles.contactText}>Phone Number: {item.phone_number}</Text>
            <Text style={styles.contactText}>Birthday: {formattedDate(item.birthday)}</Text>
            <Text style={styles.contactText}>Neurodivergence: {item.neurodivergence}</Text>
            <Text style={styles.contactText}>Last contact: {formattedDate(item.last_contact)}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(item._id)}
              color="#ff6347"
            />
            <Button
              title="Update"
              onPress={() => navigation.navigate('UpdateContact', { contact: item })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
  },
});

export default ContactList;
