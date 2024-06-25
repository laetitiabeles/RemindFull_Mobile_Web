import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format, differenceInDays } from 'date-fns';

const HomeScreenAfterLogin = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/task-list`);
      const today = new Date();
      const filteredTasks = response.data.filter(task => {
        const taskDueDate = new Date(task.due_date);
        const daysDifference = differenceInDays(taskDueDate, today);
        return daysDifference >= 0 && daysDifference <= 3;
      });
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/contacts`);
      const today = new Date();
      const filteredContacts = response.data.filter(contact => {
        const lastContactDate = new Date(contact.last_contact);
        const daysDifference = differenceInDays(today, lastContactDate);
        return daysDifference > 15;
      });
      setContacts(filteredContacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
      fetchContacts();
    }
  }, [isFocused]);

  const handleDelete = async (taskId) => {
    console.log(`handleDelete called with id: ${taskId}`);
    if (!taskId) {
      console.error('Task ID is undefined');
      return;
    }
    try {
      console.log(`Attempting to delete task with id: ${taskId}`);
      await axios.delete(`http://10.0.2.2:3000/api/task-list/${taskId}`);
      fetchTasks(); // Mettre à jour la liste après suppression
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const renderTaskItem = ({ item }) => {
    const taskId = item._id ? item._id.toString() : Math.random().toString();
    return (
      <TouchableOpacity
        style={styles.taskItem}
        key={taskId}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
      >
        <CheckBox
          value={false}
          onValueChange={() => handleDelete(item._id)}
        />
        <View style={styles.taskTextContainer}>
          <Text style={styles.taskTitle}>{item.task}</Text>
          <Text>{item.task_description}</Text>
          <Text>Priorité: {item.priority}</Text>
          <Text>Échéance: {format(new Date(item.due_date), 'dd-MM-yyyy')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item._id })}
    >
      <Text style={styles.contactEmoji}>📞</Text>
      <Text style={styles.contactText}>{item.first_name} {item.last_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Contacts"
          onPress={() => navigation.navigate('ContactList')}
        />
      </View>
      <Text style={styles.contactHeader}>Contacts à recontacter :</Text>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>Aucun contact à recontacter</Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
      <Text style={styles.taskHeader}>Tâches à échéance dans les 3 jours :</Text>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>Aucune tâche à échéance dans les 3 jours</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={item => (item._id ? item._id.toString() : Math.random().toString())}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="View all tasks"
          onPress={() => navigation.navigate('TaskList')}
        />
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
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  contactHeader: {
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  taskHeader: {
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  contactEmoji: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 18,
  },
  noContactsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreenAfterLogin;
