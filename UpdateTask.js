import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

const UpdateTask = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/api/task-list/${taskId}`);
        const taskData = response.data;
        setTask(taskData.task);
        setDescription(taskData.task_description);
        setPriority(taskData.priority);
        setDueDate(new Date(taskData.due_date));
      } catch (error) {
        console.error('Failed to fetch task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    if (!task || !dueDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await axios.put(`http://10.0.2.2:3000/api/task-list/${taskId}`, {
        task,
        task_description: description,
        priority,
        due_date: dueDate.toISOString().split('T')[0], // Format de la date en ISO
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier la tâche</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={task}
        onChangeText={setTask}
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
      <Text>Due Date:</Text>
      <DatePicker
        date={dueDate}
        onDateChange={setDueDate}
        minimumDate={new Date()} // La date minimum est la date du jour
        mode="date"
      />
      <Button title="Mettre à jour" onPress={handleUpdate} />
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

export default UpdateTask;
