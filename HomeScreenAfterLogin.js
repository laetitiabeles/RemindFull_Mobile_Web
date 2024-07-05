import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Logout from './assets/logout.svg';
import Moon from './assets/moon.svg';
import RFLogo from './assets/RFLogo.svg';
import Delete from './assets/icons-delete.svg';
import Edit from './assets/icons-edit.svg';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format, differenceInDays, parseISO, isToday, startOfDay } from 'date-fns';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Swipeable } from 'react-native-gesture-handler';
import BASE_URL from './config';

const HomeScreenAfterLogin = () => {
  const [selectedSegment, setSelectedSegment] = useState('Contacts');
  const navigation = useNavigation();
  const segmentRef = useRef(null);

  const handleSegmentChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    const segments = ['Contacts', 'Tasks'];
    setSelectedSegment(segments[selectedIndex]);
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
      <View style={styles.segmentContainer}>
        <SegmentedControl
          values={['Contacts', 'Tâches']}
          selectedIndex={selectedSegment === 'Contacts' ? 0 : 1}
          onChange={handleSegmentChange}
          style={styles.segmentControl}
          fontStyle={{ color: '#031D44', fontFamily: 'Inter-SemiBold' , fontSize: 16 }}
          tintColor="#031D44"
          backgroundColor="#fff"
          height={42}
        />
      </View>
      <View style={{ flex: 1 }}>
        {selectedSegment === 'Contacts' ? <ContactsTab /> : <TasksTab />}
      </View>
    </View>
  );
};

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const calculateDaysUntilBirthday = (birthday) => {
    const today = startOfDay(new Date());
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

    if (isToday(nextBirthday)) {
      return 0;
    }

    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    return differenceInDays(nextBirthday, today);
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/contacts`);
      const today = startOfDay(new Date());
      const filteredContacts = response.data.filter(contact => {
        const lastContactDate = startOfDay(new Date(contact.last_contact));
        const daysDifference = differenceInDays(today, lastContactDate);
        return daysDifference > 15;
      });
      const upcomingBdays = response.data.filter(contact => {
        const birthday = parseISO(contact.birthday);
        const daysUntilBirthday = calculateDaysUntilBirthday(birthday);
        return daysUntilBirthday >= 0 && daysUntilBirthday <= 7;
      }).sort((a, b) => {
        const birthdayA = parseISO(a.birthday);
        const birthdayB = parseISO(b.birthday);
        const nextBirthdayA = new Date(today.getFullYear(), birthdayA.getMonth(), birthdayA.getDate());
        const nextBirthdayB = new Date(today.getFullYear(), birthdayB.getMonth(), birthdayB.getDate());
        if (nextBirthdayA < today) nextBirthdayA.setFullYear(today.getFullYear() + 1);
        if (nextBirthdayB < today) nextBirthdayB.setFullYear(today.getFullYear() + 1);
        return nextBirthdayA - nextBirthdayB;
      });
      setContacts(filteredContacts);
      setUpcomingBirthdays(upcomingBdays);
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

  const renderBirthdayItem = ({ item }) => {
    const birthday = parseISO(item.birthday);
    const today = startOfDay(new Date());
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntilBirthday = differenceInDays(nextBirthday, today);

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => navigation.navigate('ContactDetails', { contactId: item._id })}
      >
        <View style={styles.contactContent}>
          <RFLogo style={styles.RFLogo} width={100} height={100} />
          <Text style={styles.contactText}>{item.first_name} {item.last_name}</Text>
          <Text style={styles.daysUntilText}>
            {daysUntilBirthday === 0 ? "C'est son anniversaire" : `Dans ${daysUntilBirthday} jour${daysUntilBirthday > 1 ? 's' : ''}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contactHeader}>Vous ne les avez pas contacté depuis plus de 15 jours :</Text>
      <View style={styles.contactsContainer}>
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
      <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('ContactList')}>
        <Text style={styles.contactButtonText}>Voir tous les contacts</Text>
      </TouchableOpacity>
      <Text style={styles.contactHeader}>C'est bientôt leur anniversaire 🎂</Text>
      <View style={styles.contactsContainer}>
        {upcomingBirthdays.length === 0 ? (
          <Text style={styles.noContactsText}>Aucun anniversaire à venir</Text>
        ) : (
          <FlatList
            data={upcomingBirthdays}
            renderItem={renderBirthdayItem}
            keyExtractor={(item) => item._id.toString()}
            horizontal={true}
            contentContainerStyle={styles.horizontalListContainer}
          />
        )}
      </View>
    </View>
  );
};

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCheckStates, setTaskCheckStates] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/task-list`);
      const today = new Date();
      const filteredTasks = response.data.filter(task => {
        const taskDueDate = new Date(task.due_date);
        const daysDifference = differenceInDays(taskDueDate, today);
        return daysDifference >= 0 && daysDifference <= 3;
      });
      setTasks(filteredTasks);

      // Initialize task check states
      const initialCheckStates = {};
      filteredTasks.forEach(task => {
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

  const handleCheckBoxChange = (taskId, newValue) => {
    setTaskCheckStates(prevStates => ({
      ...prevStates,
      [taskId]: newValue
    }));
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/api/task-list/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
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
          <Text style={styles.actionText}><Delete width={27} height={27} fill="#fff"></Delete></Text>
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
          onPress={() => navigation.navigate('UpdateTask', { task })}
        >
          <Text style={styles.actionText}><Edit width={27} height={27} fill="#fff"></Edit></Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTaskItem = ({ item }) => {
    const taskId = item._id ? item._id.toString() : Math.random().toString();
    return (
      <Swipeable
        renderLeftActions={(progress, dragX) => renderLeftActions(item, dragX)}
        renderRightActions={(progress, dragX) => renderRightActions(item._id, dragX)}
        overshootLeft={false}
        overshootRight={false}
      >
        <View style={styles.taskItem} key={taskId}>
          <CheckBox
            style={styles.checkbox}
            boxType='circle'
            value={taskCheckStates[item._id]}
            onValueChange={(newValue) => handleCheckBoxChange(item._id, newValue)}
            tintColors={{ true: '#031D44', false: '#031D44' }}
          />
          <TouchableOpacity
            style={styles.taskTextContainer}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
          >
            <Text style={styles.taskTitle}>{item.task}</Text>
            <Text style={styles.taskText}>{item.task_description}</Text>
            <Text style={styles.taskText}>Priorité: {item.priority}</Text>
            <Text style={styles.taskText}>Échéance: {format(new Date(item.due_date), 'dd-MM-yyyy')}</Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
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
        <TouchableOpacity style={styles.taskButton} onPress={() => navigation.navigate('CreateTask')}>
          <Text style={styles.taskButtonText}>Créer une tâche</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.taskButton} onPress={() => navigation.navigate('TaskList')}>
          <Text style={styles.taskButtonText}>Voir toutes les tâches</Text>
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
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  logoutContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  moonContainer: {
    alignSelf: 'flex-end',
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
    marginVertical: 20,
    marginHorizontal: 10,
  },
  segmentControl: {
    width: '100%',
  },
  contactsContainer: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    width: '100%',
  },
  contactHeader: {
    fontSize: 18,
    marginBottom: 20,
    width: '100%',
    fontFamily: 'Inter-SemiBold',
    color: '#031D44',
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
    marginRight: 12,
    marginLeft: 18,
    height: 150,
    width: 140,
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
    color: 'white',
  },
  daysUntilText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    color: 'white',
  },
  RFLogo: {
    marginBottom: 10,
  },
  noContactsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    marginBottom: 30,
    width: '100%',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  taskHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    width: '100%',
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
    marginBottom: 7,
    marginLeft: 20,
  },
  taskText: {
    fontFamily: 'Inter-Regular',
    color: '#031D44',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 20,
  },
  noTasksText: {
    fontFamily: 'Inter-Regular',
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
  taskButton: {
    backgroundColor: '#031D44',
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  taskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
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
  actionText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});

export default HomeScreenAfterLogin;
