import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SignUpScreen from './SignUp';
import SignInScreen from './SignIn';
import HomeScreenAfterLogin from './HomeScreenAfterLogin';
import ContactList from './ContactList';
import CreateContact from './CreateContact';
import UpdateContact from './UpdateContact';
import TaskList from './TaskList';
import CreateTask from './CreateTask';
import UpdateTask from './UpdateTask';
import TaskDetails from './TaskDetails';
import ContactDetails from './ContactDetails';
import { UserProvider } from './UserContext';


const Stack = createStackNavigator();

// Main App

function App() {
  return (
    < UserProvider >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="HomeAfterLogin" component={HomeScreenAfterLogin} />
          <Stack.Screen name="ContactList" component={ContactList} />
          <Stack.Screen name="CreateContact" component={CreateContact} />
          <Stack.Screen name="UpdateContact" component={UpdateContact} />
          <Stack.Screen name="ContactDetails" component={ContactDetails} />
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen name="CreateTask" component={CreateTask} />
          <Stack.Screen name="UpdateTask" component={UpdateTask} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;