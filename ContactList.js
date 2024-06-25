import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/contacts`);
        setContacts(response.data);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`${BASE_URL}/api/contacts/${contactId}`);
      setContacts(contacts.filter(contact => contact._id !== contactId));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item._id })}
    >
      <Text style={styles.contactText}>{item.first_name} {item.last_name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UpdateContact', { contact: item })}
        >
          <Text style={styles.buttonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactList;
