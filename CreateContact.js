import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Arrow from './assets/arrow_left.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import BASE_URL from './config';

const CreateContact = ({ navigation }) => {
  const [neurodivergences, setNeurodivergences] = useState([]);
  const [selectedNeurodivergence, setSelectedNeurodivergence] = useState(null);
  const [contact, setContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birthday: '',
    last_contact: '',
  });
  const [date, setDate] = useState(new Date());
  const [lastContactDate, setLastContactDate] = useState(new Date());
  const [error, setError] = useState('');

  const [gifts, setGifts] = useState([]);
  const [giftTitle, setGiftTitle] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftDate, setGiftDate] = useState(new Date());

  const [giftIdeas, setGiftIdeas] = useState([]);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaDate, setIdeaDate] = useState(new Date());

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showGiftIdeaModal, setShowGiftIdeaModal] = useState(false);

  useEffect(() => {
    const fetchNeurodivergences = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/neurodivergences`);
        setNeurodivergences(response.data);
      } catch (error) {
        console.error('Failed to fetch neurodivergences:', error);
      }
    };

    fetchNeurodivergences();
  }, []);

  const onDateChange = (field, event, selectedDate) => {
    const currentDate = selectedDate || (field === 'birthday' ? date : lastContactDate);
    if (field === 'birthday') {
      setDate(currentDate);
    } else {
      setLastContactDate(currentDate);
    }

    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    setContact({...contact, [field]: formattedDate});
  };

  const onGiftDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || giftDate;
    setGiftDate(currentDate);
  };

  const onIdeaDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || ideaDate;
    setIdeaDate(currentDate);
  };

  const addGift = () => {
    const newGift = {
      title: giftTitle,
      description: giftDescription,
      date: giftDate.toISOString().split('T')[0]  // Format the date as YYYY-MM-DD
    };
    setGifts([...gifts, newGift]);
    setGiftTitle('');
    setGiftDescription('');
    setGiftDate(new Date());
    setShowGiftModal(false);
  };

  const addGiftIdea = () => {
    const newIdea = {
      title: ideaTitle,
      description: ideaDescription,
      date: ideaDate.toISOString().split('T')[0]  // Format the date as YYYY-MM-DD
    };
    setGiftIdeas([...giftIdeas, newIdea]);
    setIdeaTitle('');
    setIdeaDescription('');
    setIdeaDate(new Date());
    setShowGiftIdeaModal(false);
  };

  const handleSubmit = () => {
    setError('');
  
    if (!contact.first_name || !contact.last_name) {
      setError('Les noms et prénoms sont requis');
      return;
    }
  
    const payload = {
      contact: {
        ...contact,
        neurodivergences: selectedNeurodivergence ? [selectedNeurodivergence] : [],
        gifts: gifts.map(gift => ({
          title: gift.title,
          description: gift.description,
          date: gift.date
        })),
        gift_ideas: giftIdeas.map(idea => ({
          title: idea.title,
          description: idea.description,
          date: idea.date
        }))
      }
    };
  
    console.log('Payload:', payload); // Log the payload to verify data
  
    axios.post(`${BASE_URL}/api/contacts`, payload)
      .then(response => {
        Alert.alert('Success', 'Contact created successfully', [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      })
      .catch(error => {
        setError(error.response && error.response.data ? error.response.data.error : 'An unexpected error occurred');
      });
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow/>
      </TouchableOpacity>
      <Text style={styles.title}>Créer un contact</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={contact.first_name}
        onChangeText={text => setContact({ ...contact, first_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={contact.last_name}
        onChangeText={text => setContact({ ...contact, last_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={contact.email}
        keyboardType="email-address"
        onChangeText={text => setContact({ ...contact, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={contact.phone_number}
        keyboardType="phone-pad"
        onChangeText={text => setContact({ ...contact, phone_number: text })}
      />
      <View style={styles.datePickerContainer}>
        <Text style={styles.inputLabel}>Date de naissance :</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange('birthday', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
          style={styles.dateTimePicker}
        />
      </View>
      <View style={styles.datePickerContainer}>
        <Text style={styles.inputLabel}>Date de dernier contact :</Text>
        <DateTimePicker
          value={lastContactDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange('last_contact', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
          style={styles.dateTimePicker}
        />
      </View>
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={itemValue => setSelectedNeurodivergence(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Neurodivergence" value={null} />
        {neurodivergences.map(nd => (
          <Picker.Item key={nd.id} label={nd.type} value={nd.id} />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.addGiftButton}
        onPress={() => setShowGiftModal(true)}
      >
        <Text style={styles.addGiftButtonText}>Ajouter un cadeau</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addGiftIdeaButton}
        onPress={() => setShowGiftIdeaModal(true)}
      >
        <Text style={styles.addGiftIdeaButtonText}>Ajouter une idée cadeau</Text>
      </TouchableOpacity>
      <FlatList
        data={gifts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.title} - {item.description} - {item.date}</Text>
          </View>
        )}
      />
      <FlatList
        data={giftIdeas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.title} - {item.description} - {item.date}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => handleSubmit()}
      >
        <Text style={styles.createButtonText}>Créer le contact</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showGiftModal}
        onRequestClose={() => setShowGiftModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setShowGiftModal(false)} style={styles.backButton}>
              <Text style={styles.backButtonText}><Arrow width={32} height={32} fill="#031D44"></Arrow></Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Gift</Text>
            <TextInput
              style={styles.input}
              placeholder="Gift Title"
              value={giftTitle}
              onChangeText={setGiftTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Gift Description"
              value={giftDescription}
              onChangeText={setGiftDescription}
            />
            <Text>Date of Gift:</Text>
            <DateTimePicker
              value={giftDate}
              mode="date"
              display="default"
              onChange={onGiftDateChange}
              maximumDate={new Date()}
            />
            <TouchableOpacity onPress={addGift} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showGiftIdeaModal}
        onRequestClose={() => setShowGiftIdeaModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setShowGiftIdeaModal(false)} style={styles.backButton}>
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Gift Idea</Text>
            <TextInput
              style={styles.input}
              placeholder="Idea Title"
              value={ideaTitle}
              onChangeText={setIdeaTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Idea Description"
              value={ideaDescription}
              onChangeText={setIdeaDescription}
            />
            <Text>Date of Idea:</Text>
            <DateTimePicker
              value={ideaDate}
              mode="date"
              display="default"
              onChange={onIdeaDateChange}
              maximumDate={new Date()}
            />
            <TouchableOpacity onPress={addGiftIdea} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderWidth: 1.7,
    borderColor: '#031D44',
    borderRadius: 20,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: '#031D44',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 16,
  },
  dateTimePicker: {
    width: 150, // Adjust width as needed
  },
  picker: {
    width: '100%',
    height: 30,
    marginBottom: 100,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addGiftButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    marginBottom: 0,
  },
  addGiftButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  addGiftIdeaButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  addGiftIdeaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: '50%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 24,
    marginBottom: 20,
    marginTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 20,
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
  okButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default CreateContact;
