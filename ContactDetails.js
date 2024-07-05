import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Arrow from './assets/arrow_left.svg';
import Delete from './assets/icons-delete.svg';
import Edit from './assets/icons-edit.svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
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
        const giftsResponse = await axios.get(`${BASE_URL}/api/gifts/contact/${contactId}`);
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
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.gift_title}</Text>
        <Text style={styles.itemText}>{item.gift_description}</Text>
        <Text style={styles.itemText}>{formatDate(item.gift_date)}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UpdateGift', { gift: item })}
        >
          <Edit width={20} height={20} fill="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteGift(item.gift_id)}
        >
          <Delete width={20} height={20} fill="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGiftIdeaItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.gift_title}</Text>
        <Text style={styles.itemText}>{item.idea_description}</Text>
        <Text style={styles.itemText}>{formatDate(item.idea_date)}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UpdateGiftIdea', { giftIdea: item })}
        >
          <Edit width={20} height={20} fill="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteGiftIdea(item.idea_id)}
        >
          <Delete width={20} height={20} fill="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Détails du contact</Text>
      <Text style={styles.label}>Prénom: {contact.first_name}</Text>
      <Text style={styles.label}>Nom: {contact.last_name}</Text>
      <Text style={styles.label}>Email: {contact.email}</Text>
      <Text style={styles.label}>Téléphone: {contact.phone_number}</Text>
      <Text style={styles.label}>Date de naissance: {formatDate(contact.birthday)}</Text>
      <Text style={styles.label}>Dernier contact: {formatDate(contact.last_contact)}</Text>
      <Text style={styles.label}>Neurodivergence: {contact.neurodivergence}</Text>

      <Text style={styles.sectionTitle}>Cadeaux</Text>
      {gifts.length === 0 ? (
        <Text style={styles.noItemsText}>Pas de cadeaux trouvés</Text>
      ) : (
        <FlatList
          data={gifts}
          renderItem={renderGiftItem}
          keyExtractor={(item) => item.gift_id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addGiftButton}
        onPress={() => navigation.navigate('AddGift', { contactId })}
      >
        <Text style={styles.buttonText}>Ajouter un cadeau</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Idées cadeaux</Text>
      {giftIdeas.length === 0 ? (
        <Text style={styles.noItemsText}>Pas d'idées cadeaux trouvées</Text>
      ) : (
        <FlatList
          data={giftIdeas}
          renderItem={renderGiftIdeaItem}
          keyExtractor={(item) => item.idea_id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.addGiftButton}
        onPress={() => navigation.navigate('AddGiftIdea', { contactId })}
      >
        <Text style={styles.buttonText}>Ajouter une idée cadeau</Text>
      </TouchableOpacity>
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
  title: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 24,
    marginBottom: 30,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#B3EAF1',
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
  addGiftButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default ContactDetails;
