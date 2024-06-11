import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/contacts')
      .then(response => {
        console.log(response.data); // Vérifier les données
        setContacts(response.data);
      })
      .catch(error => console.error(error));
  }, []);

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
  },
  contactText: {
    fontSize: 16,
  },
});

export default ContactList;
