import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`${BASE_URL}/api/contacts/${contactId}`);
      fetchContacts(); // Refresh the contact list after deletion
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item._id })}
    >
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactText}>{item.first_name} {item.last_name}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateContact', { contactId: item._id })}>
        <Text style={styles.contactButton}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item._id)}>
        <Text style={styles.contactButton}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search contacts..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactText: {
    fontSize: 18,
  },
  contactButton: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});

export default ContactList;
