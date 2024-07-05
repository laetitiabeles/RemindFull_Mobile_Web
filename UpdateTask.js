import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Arrow from './assets/arrow_left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import BASE_URL from './config';

const formatDate = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const UpdateTask = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params;

  // Références pour les champs de texte
  const descriptionRef = useRef(null);
  const priorityRef = useRef(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/task-list/${taskId}`);
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
    try {
      const formattedDueDate = formatDate(dueDate);
      await axios.put(`${BASE_URL}/api/task-list/${taskId}`, {
        task,
        task_description: description,
        priority,
        due_date: formattedDueDate,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
      </TouchableOpacity>
      <Text style={styles.title}>Modifier la tâche</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={task}
        onChangeText={setTask}
        returnKeyType="next"
        onSubmitEditing={() => descriptionRef.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        ref={descriptionRef}
        returnKeyType="next"
        onSubmitEditing={() => priorityRef.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Priorité"
        value={priority}
        onChangeText={setPriority}
        ref={priorityRef}
        returnKeyType="done"
      />
      <Text style={styles.dueDate}>Due Date:</Text>
      <DatePicker
        date={dueDate}
        onDateChange={setDueDate}
        minimumDate={new Date()}
        mode="date"
      />
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => handleUpdate()}
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
    fontSize: 20,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});

export default UpdateTask;
