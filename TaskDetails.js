import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Arrow from './assets/arrow_left.svg';
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.titlePage}>Détails de la tâche</Text>
      <Text style={styles.title}>{task.task}</Text>
      <Text style={styles.taskDescription}>Description: {task.task_description}</Text>
      <Text style={styles.taskDescription}>Priorité: {task.priority}</Text>
      <Text style={styles.taskDescription}>Échéance: {format(new Date(task.due_date), 'dd-MM-yyyy')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('UpdateTask', { taskId })}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
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
  titlePage: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    color: '#031D44',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    color: '#031D44',
  },
  taskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default TaskDetails;
