import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

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
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showLastContactPicker, setShowLastContactPicker] = useState(false);
  const [error, setError] = useState('');

  const [gifts, setGifts] = useState([]);
  const [giftTitle, setGiftTitle] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftDate, setGiftDate] = useState(new Date());
  const [showGiftDatePicker, setShowGiftDatePicker] = useState(false);

  const [giftIdeas, setGiftIdeas] = useState([]);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaDate, setIdeaDate] = useState(new Date());
  const [showIdeaDatePicker, setShowIdeaDatePicker] = useState(false);

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showGiftIdeaModal, setShowGiftIdeaModal] = useState(false);

  useEffect(() => {
    const fetchNeurodivergences = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/api/neurodivergences`);
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
      setShowBirthdayPicker(false);
      setDate(currentDate);
    } else {
      setShowLastContactPicker(false);
      setLastContactDate(currentDate);
    }

    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    setContact({...contact, [field]: formattedDate});
  };

  const onGiftDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || giftDate;
    setShowGiftDatePicker(false);
    setGiftDate(currentDate);
  };

  const onIdeaDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || ideaDate;
    setShowIdeaDatePicker(false);
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
      setError('First name and last name are required.');
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
  
    axios.post(`http://10.0.2.2:3000/api/contacts`, payload)
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
      <Text style={styles.title}>Create Contact</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={contact.first_name}
        onChangeText={text => setContact({ ...contact, first_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
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
        placeholder="Phone Number"
        value={contact.phone_number}
        keyboardType="phone-pad"
        onChangeText={text => setContact({ ...contact, phone_number: text })}
      />
      <TouchableOpacity onPress={() => setShowBirthdayPicker(true)} style={styles.input}>
        <Text>{contact.birthday || "Select Birthday"}</Text>
      </TouchableOpacity>
      {showBirthdayPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => onDateChange('birthday', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
        />
      )}
      <TouchableOpacity onPress={() => setShowLastContactPicker(true)} style={styles.input}>
        <Text>{contact.last_contact || "Select Last Contact Date"}</Text>
      </TouchableOpacity>
      {showLastContactPicker && (
        <DateTimePicker
          value={lastContactDate}
          mode="date"
          onChange={(event, selectedDate) => onDateChange('last_contact', event, selectedDate)}
          maximumDate={new Date()} // Prevent future dates
        />
      )}
      <Picker
        selectedValue={selectedNeurodivergence}
        onValueChange={itemValue => setSelectedNeurodivergence(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Neurodivergence" value={null} />
        {neurodivergences.map(nd => (
          <Picker.Item key={nd.id} label={nd.type} value={nd.id} />
        ))}
      </Picker>
      <Button title="Add Gift" onPress={() => setShowGiftModal(true)} />
      <Button title="Add Gift Idea" onPress={() => setShowGiftIdeaModal(true)} />
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
      <Button title="Create Contact" onPress={handleSubmit} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showGiftModal}
        onRequestClose={() => setShowGiftModal(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => setShowGiftModal(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Gift</Text>
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
          <TouchableOpacity onPress={() => setShowGiftDatePicker(true)} style={styles.input}>
            <Text>{giftDate.toDateString() || "Select Gift Date"}</Text>
          </TouchableOpacity>
          {showGiftDatePicker && (
            <DateTimePicker
              value={giftDate}
              mode="date"
              display="default"
              onChange={onGiftDateChange}
              maximumDate={new Date()}
            />
          )}
          <Button title="OK" onPress={addGift} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showGiftIdeaModal}
        onRequestClose={() => setShowGiftIdeaModal(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => setShowGiftIdeaModal(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Gift Idea</Text>
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
          <TouchableOpacity onPress={() => setShowIdeaDatePicker(true)} style={styles.input}>
            <Text>{ideaDate.toDateString() || "Select Idea Date"}</Text>
          </TouchableOpacity>
          {showIdeaDatePicker && (
            <DateTimePicker
              value={ideaDate}
              mode="date"
              display="default"
              onChange={onIdeaDateChange}
              maximumDate={new Date()}
            />
          )}
          <Button title="OK" onPress={addGiftIdea} />
        </View>
      </Modal>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default CreateContact;
