import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BASE_URL from './config';
import { format } from 'date-fns';
import Arrow from './assets/arrow_left.svg';
import Delete from './assets/icons-delete.svg';
import Edit from './assets/icons-edit.svg';
import { Swipeable } from 'react-native-gesture-handler';

const formattedDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCheckStates, setTaskCheckStates] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/task-list`);
      setTasks(response.data);

      // Initialize task check states
      const initialCheckStates = {};
      response.data.forEach(task => {
        initialCheckStates[task._id] = false;
      });
      setTaskCheckStates(initialCheckStates);
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
    console.log(`handleDelete called with id: ${id}`);
    if (!id) {
      console.error('Task ID is undefined');
      return;
    }
    try {
      console.log(`Attempting to delete task with id: ${id}`);
      await axios.delete(`${BASE_URL}/api/task-list/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCheckBoxChange = (taskId, newValue) => {
    setTaskCheckStates(prevStates => ({
      ...prevStates,
      [taskId]: newValue
    }));

    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task._id === taskId) {
          return { ...task, checked: newValue };
        }
        return task;
      });
      const sortedTasks = updatedTasks.sort((a, b) => (a.checked === b.checked) ? 0 : a.checked ? 1 : -1);
      return sortedTasks;
    });
  };

  const renderRightActions = (taskId, dragX) => {
    const opacity = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
    });

    return (
      <Animated.View style={[styles.rightAction, { opacity }]}>
        <TouchableOpacity
          onPress={() => handleDelete(taskId)}
        >
          <Delete width={27} height={27} fill="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLeftActions = (task, dragX) => {
    const opacity = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
    });

    return (
      <Animated.View style={[styles.leftAction, { opacity }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateTask', { taskId: task._id })}
        >
          <Edit width={27} height={27} fill="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item }) => {
    console.log(`Rendering item with id: ${item._id}`);
    return (
      <Swipeable
        renderLeftActions={(progress, dragX) => renderLeftActions(item, dragX)}
        renderRightActions={(progress, dragX) => renderRightActions(item._id, dragX)}
        overshootLeft={false}
        overshootRight={false}
      >
        <View style={styles.taskItem}>
          <CheckBox
            style={styles.checkbox}
            boxType='circle'
            value={taskCheckStates[item._id]}
            onValueChange={(newValue) => handleCheckBoxChange(item._id, newValue)}
            tintColors={{ true: '#031D44', false: '#031D44' }}
          />
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>{item.task}</Text>
            <Text style={styles.taskText}>{item.task_description}</Text>
            <Text style={styles.taskText}>Priorité: {item.priority}</Text>
            <Text style={styles.taskText}>Échéance: {formattedDate(item.due_date)}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeAfterLogin')} style={styles.arrowContainer}>
        <Arrow width={32} height={32} fill="#031D44"/>
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
    backgroundColor: 'white',
    paddingTop: 100,
  },
  arrowContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    paddingTop: 50,
    backgroundColor: 'white',
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
    marginVertical: 5,
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
    marginLeft: 20,
  },
  taskText: {
    fontFamily: 'Inter-Regular',
    color: '#031D44',
    fontSize: 14,
    marginLeft: 20,
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  checkbox: {
    width: 25,
    height: 25,
    paddingLeft: 10,
  },
  rightAction: {
    backgroundColor: '#FFCBA4',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 70,
    height: '90%',
    marginVertical: 5,
  },
  leftAction: {
    backgroundColor: '#B3EAF1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    width: 80,
    height: '90%',
    marginVertical: 5,
  },
});

export default TaskList;
