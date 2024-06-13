import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';

const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://10.0.2.2:3000/api/contacts') // for Android Emulator
      .then(response => {
        console.log(response.data); // Vérifier les données
        setContacts(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (contactId) => {
    Alert.alert(
      "Confirm Delete", // Titre de l'alerte
      "Are you sure you want to delete this contact?", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"), // Log ou autre action
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => deleteContact(contactId) // Fonction qui exécute la suppression
        }
      ]
    );
  };
  
  const deleteContact = (contactId) => {
    axios.delete(`http://10.0.2.2:3000/api/contacts/${contactId}`)
      .then(response => {
        Alert.alert('Success', 'Contact deleted successfully');
        // Update state to remove the contact from the list
        setContacts(contacts.filter(contact => contact._id !== contactId));
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to delete the contact');
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>Name: {item.first_name} {item.last_name}</Text>
            <Text style={styles.contactText}>Email: {item.email}</Text>
            <Text style={styles.contactText}>Phone Number: {item.phone_number}</Text>
            <Text style={styles.contactText}>Birthday: {item.birthday}</Text>
            <Text style={styles.contactText}>Neurodivergence: {item.neurodivergence}</Text>
            <Text style={styles.contactText}>Last contact: {item.last_contact}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(item._id)}
              color="#ff6347" // Tomato color for the delete button
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
    marginBottom: 10, // Added space below each item for clarity
  },
  contactText: {
    fontSize: 16,
  },
});

export default ContactList;
