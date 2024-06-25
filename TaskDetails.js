import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import BASE_URL from './config';

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/task-list/${taskId}`);
        setTask(response.data);
      } catch (error) {
        console.error('Failed to fetch task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/task-list/${taskId}`);
      Alert.alert('Succès', 'Tâche supprimée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Erreur', 'Échec de la suppression de la tâche');
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Chargement des détails de la tâche...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.task}</Text>
      <Text>Description: {task.task_description}</Text>
      <Text>Priorité: {task.priority}</Text>
      <Text>Échéance: {format(new Date(task.due_date), 'dd-MM-yyyy')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateTask', { taskId })}>
          <Text style={styles.button}>✏️ Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.button}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});

export default TaskDetails;
