import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import BASE_URL from './config';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};

const ContactDetails = () => {
  const [contact, setContact] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { contactId } = route.params;

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/contacts/${contactId}`);
        setContact(response.data);
      } catch (error) {
        console.error('Failed to fetch contact details:', error);
      }
    };

    fetchContactDetails();
  }, [contactId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/contacts/${contactId}`);
      Alert.alert('Succès', 'Contact supprimé avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le contact');
    }
  };

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Details</Text>
      <Text style={styles.label}>First Name: {contact.first_name}</Text>
      <Text style={styles.label}>Last Name: {contact.last_name}</Text>
      <Text style={styles.label}>Email: {contact.email}</Text>
      <Text style={styles.label}>Phone Number: {contact.phone_number}</Text>
      <Text style={styles.label}>Birthday: {formatDate(contact.birthday)}</Text>
      <Text style={styles.label}>Last Contact: {formatDate(contact.last_contact)}</Text>
      <Text style={styles.label}>Neurodivergence: {contact.neurodivergence}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UpdateContact', { contact })}
        >
          <Text style={styles.buttonText}>✏️ Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
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

export default ContactDetails;
