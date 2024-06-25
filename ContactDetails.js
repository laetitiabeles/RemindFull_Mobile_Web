import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import BASE_URL from './config';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};

const ContactDetails = () => {
  const [contact, setContact] = useState(null);
  const route = useRoute();
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
});

export default ContactDetails;
