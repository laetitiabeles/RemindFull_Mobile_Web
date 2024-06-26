import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from './config';

const UpdateGift = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gift } = route.params;

  const [giftTitle, setGiftTitle] = useState(gift.gift_title || '');
  const [description, setDescription] = useState(gift.gift_description || '');
  const [date, setDate] = useState(new Date(gift.gift_date));

  const handleUpdateGift = async () => {
    try {
      // Convertir la date en ISO sans décalage de fuseau horaire
      const giftDateISO = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      await axios.put(`${BASE_URL}/api/gifts/${gift.gift_id}`, {
        contact_id: gift.contact_id, // Assurez-vous que l'ID du contact est maintenu
        gift_title: giftTitle,
        gift_description: description,
        gift_date: giftDateISO,
        profile_id: gift.profile_id, // Ajoutez le profile_id si nécessaire
      });
      Alert.alert('Succès', 'Cadeau mis à jour avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update gift:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le cadeau');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mettre à jour le cadeau</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre du cadeau"
        value={giftTitle}
        onChangeText={setGiftTitle}
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
      <Button title="Mettre à jour" onPress={handleUpdateGift} />
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

export default UpdateGift;
