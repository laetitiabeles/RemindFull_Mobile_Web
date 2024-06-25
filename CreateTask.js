import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

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
      const response = await axios.post(`http://10.0.2.2:3000/api/task-list`, {
        task: title,
        task_description: description,
        priority,
        due_date: dueDate.toISOString().split('T')[0], // Format de la date en ISO
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
        placeholder="Priority"
        value={priority}
        onChangeText={setPriority}
      />
      <Text>Due Date:</Text>
      <DatePicker
        date={dueDate}
        onDateChange={setDueDate}
        minimumDate={new Date()} // La date minimum est la date du jour
        mode="date"
      />
      <Button title="Créer" onPress={handleCreateTask} />
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

export default CreateTask;
