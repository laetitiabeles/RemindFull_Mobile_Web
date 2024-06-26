import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import BASE_URL from './config';

const AddGiftIdea = ({ route, navigation }) => {
  const { contactId } = route.params;
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());

  const handleAddGiftIdea = async () => {
    try {
      await axios.post(`${BASE_URL}/api/gift_ideas`, {
        contact_id: contactId,
        idea_description: description,
        idea_date: date.toISOString().split('T')[0],
      });
      Alert.alert('Succès', 'Idée cadeau ajoutée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add gift idea:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'idée cadeau');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une idée cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Description de l'idée cadeau"
        value={description}
        onChangeText={setDescription}
      />
      <Text>Date de l'idée cadeau :</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
      />
      <Button title="Ajouter" onPress={handleAddGiftIdea} />
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

export default AddGiftIdea;
