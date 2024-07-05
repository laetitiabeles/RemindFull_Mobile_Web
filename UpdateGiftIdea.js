import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Arrow from './assets/arrow_left.svg';
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Mettre à jour l'idée cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de l'idée"
        value={ideaTitle}
        onChangeText={setIdeaTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.giftDate}>Date de l'idée :</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
      />
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateGiftIdea}
      >
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
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
  updateButton: {
    backgroundColor: '#031D44',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default UpdateGiftIdea;
