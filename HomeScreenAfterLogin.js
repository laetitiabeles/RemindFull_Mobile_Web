import React, { useState, useEffect, useRef } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Logout from './assets/logout.svg';
import Moon from './assets/moon.svg';
import CheckBox from '@react-native-community/checkbox';
import RFLogo from './assets/RFLogo.svg';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format, differenceInDays } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const HomeScreenAfterLogin = () => {
  const [selectedSegment, setSelectedSegment] = useState('Contacts');
  const navigation = useNavigation();
  const segmentRef = useRef(null);
  const contactButtonRef = useRef(null);
  const taskButtonRef = useRef(null);

  const handleSegmentChange = (segment) => {
    if (segmentRef.current) {
      segmentRef.current.fadeOut(70).then(() => {
        setSelectedSegment(segment);
        segmentRef.current.fadeIn(70);
      });
    } else {
      setSelectedSegment(segment);
    }
  };

  const handleButtonPress = (buttonRef, segment) => {
    if (buttonRef.current) {
      buttonRef.current.pulse(300).then(() => {
        handleSegmentChange(segment);
      });
    } else {
      handleSegmentChange(segment);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logoutContainer}>
          <Logout width={32} height={32} fill="#031D44" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moonContainer}>
          <Moon width={48} height={48} fill="#031D44" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Laë 👋🏻</Text>
      </View>
      <LinearGradient
        colors={['#EDEDED', '#fff', '#fff']}
        locations={[0, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.segmentContainer}
      >
        <Animatable.View ref={contactButtonRef} style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              styles.segment,
              selectedSegment === 'Contacts' && styles.selectedSegment,
            ]}
            onPress={() => handleButtonPress(contactButtonRef, 'Contacts')}
          >
            <Text style={styles.segmentText}>📞 Contacts</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View ref={taskButtonRef} style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              styles.segment,
              selectedSegment === 'Tasks' && styles.selectedSegment,
            ]}
            onPress={() => handleButtonPress(taskButtonRef, 'Tasks')}
          >
            <Text style={styles.segmentText}>📝 Tasks</Text>
          </TouchableOpacity>
        </Animatable.View>
      </LinearGradient>
      <View style={styles.roundedShape}>
        <Text></Text>
      </View>
      <Animatable.View ref={segmentRef} style={{ flex: 1 }}>
        {selectedSegment === 'Contacts' ? <ContactsTab /> : <TasksTab />}
      </Animatable.View>
    </View>
  );
};

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
      fetchContacts();
    }
  }, [isFocused]);

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item._id })}
    >
      <View style={styles.contactContent}>
        <RFLogo style={styles.RFLogo} width={100} height={100} />
        <Text style={styles.contactText}>{item.first_name} {item.last_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.contactHeader}>Ça fait longtemps 💡</Text>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>Aucun contact à recontacter</Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item._id.toString()}
          horizontal={true}
          contentContainerStyle={styles.horizontalListContainer}
        />
      )}
    </View>
  );
};

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
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

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const handleDelete = async (taskId) => {
    if (!taskId) {
      console.error('Task ID is undefined');
      return;
    }
    try {
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

  return (
    <View style={styles.container}>
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
    backgroundColor: '#f9f9ea',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
  },
  selectedSegment: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    elevation: 10,
  },
  segmentText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
  },
  roundedShape: {
    backgroundColor: '#f9f9ea',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 20, // Adjust as needed to overlap the segment control
    elevation: 15,
    height: 40,
  },
  logoutContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  moonContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  contactHeader: {
    fontSize: 18,
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
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
  horizontalListContainer: {
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  contactItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginRight: 25,
    backgroundColor: 'white',
    height: 150, // Adjust as needed
    width: 150,  // Adjust as needed
    elevation: 0,
  },
  contactContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
  },
  RFLogo: {
    marginBottom: 10, // Add some space between the logo and the text
  },
  noContactsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
});

export default HomeScreenAfterLogin;
