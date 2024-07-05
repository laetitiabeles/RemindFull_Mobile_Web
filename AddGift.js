import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Arrow from './assets/arrow_left.svg';
import axios from 'axios';
import BASE_URL from './config';

const AddGift = ({ route, navigation }) => {
  const { contactId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());

  const handleAddGift = async () => {
    try {
      await axios.post(`${BASE_URL}/api/gifts`, {
        contact_id: contactId,
        gift_title: title,
        gift_description: description,
        gift_date: date.toISOString().split('T')[0],
      });
      Alert.alert('Succès', 'Cadeau ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add gift:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le cadeau');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Ajouter un cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre du cadeau"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.giftDate}>Date du cadeau :</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleAddGift}
      >
        <Text style={styles.createButtonText}>Ajouter le cadeau</Text>
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
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    color: '#031D44',
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
    marginBottom: 20,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: '#031D44',
  },
  giftDate: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 18,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#031D44',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default AddGift;
