import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
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
      <Text style={styles.title}>Ajouter un cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre du cadeau"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description du cadeau"
        value={description}
        onChangeText={setDescription}
      />
      <Text>Date du cadeau :</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
      />
      <Button title="Ajouter" onPress={handleAddGift} />
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
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddGift;
