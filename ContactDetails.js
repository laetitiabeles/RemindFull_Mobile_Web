import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, parseISO, addHours } from 'date-fns';
import BASE_URL from './config';

// Formater la date sans ajuster le fuseau horaire
const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'dd-MM-yyyy');
};

const ContactDetails = () => {
  const [contact, setContact] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [giftIdeas, setGiftIdeas] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { contactId } = route.params;

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        console.log(`Fetching details for contact ID: ${contactId}`);
        const contactResponse = await axios.get(`${BASE_URL}/api/contacts/${contactId}`);
        console.log('Contact details fetched successfully');
        setContact(contactResponse.data);

        console.log(`Fetching gifts for contact ID: ${contactId}`);
        const giftsResponse = await axios.get(`http://10.0.2.2:3000/api/gifts/contact/${contactId}`);
        console.log('Gifts fetched successfully');
        setGifts(giftsResponse.data);

        console.log(`Fetching gift ideas for contact ID: ${contactId}`);
        const giftIdeasResponse = await axios.get(`${BASE_URL}/api/gift_ideas/contact/${contactId}`);
        console.log('Gift ideas fetched successfully');
        setGiftIdeas(giftIdeasResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response && error.response.status === 400) {
          console.error('Received 400 Bad Request:', error.response.data);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    };

    fetchContactDetails();
  }, [contactId]);

  const handleDeleteGift = async (giftId) => {
    try {
      await axios.delete(`${BASE_URL}/api/gifts/${giftId}`);
      setGifts(gifts.filter(gift => gift.gift_id !== giftId));
    } catch (error) {
      console.error('Failed to delete gift:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le cadeau');
    }
  };

  const handleDeleteGiftIdea = async (ideaId) => {
    try {
      await axios.delete(`${BASE_URL}/api/gift_ideas/${ideaId}`);
      setGiftIdeas(giftIdeas.filter(idea => idea.idea_id !== ideaId));
    } catch (error) {
      console.error('Failed to delete gift idea:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'idée cadeau');
    }
  };

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderGiftItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.gift_title} - {item.gift_description} - {formatDate(item.gift_date)}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('UpdateGift', { gift: item })}
      >
        <Text style={styles.buttonText}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGift(item.gift_id)}
      >
        <Text style={styles.buttonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGiftIdeaItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.gift_title} - {item.idea_description} - {formatDate(item.idea_date)}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('UpdateGiftIdea', { giftIdea: item })}
      >
        <Text style={styles.buttonText}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGiftIdea(item.idea_id)}
      >
        <Text style={styles.buttonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

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

      <Text style={styles.sectionTitle}>Gifts</Text>
      {gifts.length === 0 ? (
        <Text style={styles.noItemsText}>Pas de cadeaux trouvés</Text>
      ) : (
        <FlatList
          data={gifts}
          renderItem={renderGiftItem}
          keyExtractor={(item) => item.gift_id.toString()}
        />
      )}
      <Button title="Add Gift" onPress={() => navigation.navigate('AddGift', { contactId })} />

      <Text style={styles.sectionTitle}>Gift Ideas</Text>
      {giftIdeas.length === 0 ? (
        <Text style={styles.noItemsText}>Pas d'idées cadeaux trouvées</Text>
      ) : (
        <FlatList
          data={giftIdeas}
          renderItem={renderGiftIdeaItem}
          keyExtractor={(item) => item.idea_id.toString()}
        />
      )}
      <Button title="Add Gift Idea" onPress={() => navigation.navigate('AddGiftIdea', { contactId })} />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default ContactDetails;
