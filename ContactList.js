import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from './config';
import { format } from 'date-fns';

const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const fetchContacts = () => {
    axios.get(`${BASE_URL}/api/contacts`)
      .then(response => {
        console.log('Data received:', response.data);
        setContacts(response.data);
        setFilteredContacts(response.data);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Search query:', query); // Log search query
    if (query === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.first_name.toLowerCase().includes(query.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(query.toLowerCase()) ||
        (contact.neurodivergence?.toLowerCase() ?? '').includes(query.toLowerCase())
      );
      console.log('Filtered contacts:', filtered); // Log filtered contacts
      setFilteredContacts(filtered);
    }
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
    axios.delete(`http://${BASE_URL}/api/contacts/${contactId}`)
      .then(response => {
        Alert.alert('Success', 'Contact deleted successfully');
        const updatedContacts = contacts.filter(contact => contact._id !== contactId);
        setContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
        Alert.alert('Error', 'Failed to delete the contact');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un contact ou une neurodivergence"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredContacts.length === 0 ? (
        <Text style={styles.noContactsText}>Aucun contact</Text>
      ) : (
        <View>
          <Button
            title="Créer un contact"
            onPress={() => navigation.navigate('CreateContact')}
            color="#007BFF"
          />
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>Nom: {item.first_name} {item.last_name}</Text>
                <Text style={styles.contactText}>Email: {item.email}</Text>
                <Text style={styles.contactText}>Téléphone: {item.phone_number}</Text>
                <Text style={styles.contactText}>Anniversaire: {formattedDate(item.birthday)}</Text>
                <Text style={styles.contactText}>Neurodivergence: {item.neurodivergence}</Text>
                <Text style={styles.contactText}>Dernier contact: {formattedDate(item.last_contact)}</Text>
                <Button
                  title="Supprimer"
                  onPress={() => handleDelete(item._id)}
                  color="#ff6347"
                />
                <Button
                  title="Modifier"
                  onPress={() => navigation.navigate('UpdateContact', { contact: item })}
                />
              </View>
            )}
          />
        </View>
      )}
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
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
    borderRadius: 5,
  },
  noContactsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
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
