import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from './config';

const UpdateGiftIdea = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { giftIdea } = route.params;

  const [ideaTitle, setIdeaTitle] = useState(giftIdea.gift_title || '');
  const [description, setDescription] = useState(giftIdea.idea_description || '');
  const [date, setDate] = useState(new Date(giftIdea.idea_date));

  const handleUpdateGiftIdea = async () => {
    try {
      // Convertir la date en ISO sans décalage de fuseau horaire
      const ideaDateISO = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      await axios.put(`${BASE_URL}/api/gift_ideas/${giftIdea.idea_id}`, {
        contact_id: giftIdea.contact_id, // Assurez-vous que l'ID du contact est maintenu
        gift_title: ideaTitle,
        idea_description: description,
        idea_date: ideaDateISO,
        profile_id: giftIdea.profile_id, // Ajoutez le profile_id si nécessaire
      });
      Alert.alert('Succès', 'Idée cadeau mise à jour avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update gift idea:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'idée cadeau');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mettre à jour l'idée cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de l'idée cadeau"
        value={ideaTitle}
        onChangeText={setIdeaTitle}
      />
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
      <Button title="Mettre à jour" onPress={handleUpdateGiftIdea} />
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

export default UpdateGiftIdea;
