import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Arrow from './assets/arrow_left.svg';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import BASE_URL from './config';

const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const navigation = useNavigation();
  const { user } = useUser();

  const handleCreateTask = async () => {
    if (!title || !dueDate) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et la date d\'échéance');
      return;
    }

    try {
      const formattedDueDate = formatDate(dueDate);
      const response = await axios.post(`${BASE_URL}/api/task-list`, {
        task: title,
        task_description: description,
        priority,
        due_date: formattedDueDate,
        profile_id: user.profile_id,
      });

      if (response.status === 201) {
        Alert.alert('Succès', 'Tâche créée avec succès');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', 'Échec de la création de la tâche');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      Alert.alert('Erreur', 'Échec de la création de la tâche');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Créer une tâche</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Priorité"
        value={priority}
        onChangeText={setPriority}
      />
      <Text style={styles.dueDate}>Due Date:</Text>
      <DatePicker
        date={dueDate}
        onDateChange={setDueDate}
        minimumDate={new Date()} // La date minimum est la date du jour
        mode="date"
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => handleCreateTask()}
      >
        <Text style={styles.createButtonText}>Créer</Text>
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
  dueDate: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 18,
    marginBottom: 10,
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
});

export default CreateTask;
