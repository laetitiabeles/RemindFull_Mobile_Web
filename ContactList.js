import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Arrow from './assets/arrow_left.svg';
import Delete from './assets/icons-delete.svg';
import Edit from './assets/icons-edit.svg';
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

  const handleUpdateContact = (updatedContact) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
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
          onPress={() => navigation.navigate('UpdateContact', { contact: item, onUpdate: handleUpdateContact })} // Passer onUpdate
        >
          <Edit width={20} height={20} fill="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
          <Delete width={20} height={20} fill="#fff"/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateContact')}>
        <Text style={styles.createButtonText}>Créer un contact</Text>
      </TouchableOpacity>
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
    backgroundColor: 'white',
    paddingTop: 120,
  },
  arrowContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  createButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    fontFamily: 'Inter-Regular',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingLeft: 20,
  },
  contactItem: {
    fontFamily: 'Inter-Regular',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    color: '#031D44',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#B3E1F4',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#FFCBA4',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default ContactList;
