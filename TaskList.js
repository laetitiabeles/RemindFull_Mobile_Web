import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BASE_URL from './config';
import { format } from 'date-fns';
import Arrow from './assets/arrow_left.svg';

const formattedDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/task-list`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const handleDelete = async (id) => {
    console.log(`handleDelete called with id: ${id}`); // Log for debugging
    if (!id) {
      console.error('Task ID is undefined');
      return;
    }
    try {
      console.log(`Attempting to delete task with id: ${id}`); // Log for debugging
      await axios.delete(`${BASE_URL}/api/task-list/${id}`);
      fetchTasks(); // Mettre à jour la liste après suppression
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const renderItem = ({ item }) => {
    console.log(`Rendering item with id: ${item._id}`); // Log for debugging
    return (
      <View style={styles.taskItem}>
        <CheckBox
          value={false}
          onValueChange={() => handleDelete(item._id)}
        />
        <View style={styles.taskTextContainer}>
          <Text style={styles.taskTitle}>{item.task}</Text>
          <Text style={styles.taskText}>{item.task_description}</Text>
          <Text style={styles.taskText}>Priorité: {item.priority}</Text>
          <Text style={styles.taskText}>Échéance: {formattedDate(item.due_date)}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UpdateTask', { taskId: item._id })}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#FBFBF1"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateTask', { fetchTasks })}>
        <Text style={styles.createButtonText}>Créer une tâche</Text>
      </TouchableOpacity>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>Pas de tâches trouvées</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  arrowContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
    fontSize: 18,
  },
  taskText: {
    fontFamily: 'Inter-Regular',
    color: '#031D44',
    fontSize: 14,
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#031D44',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
  },

});

export default TaskList;
