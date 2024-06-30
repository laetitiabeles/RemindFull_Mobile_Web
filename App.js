import React from 'react';
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
import AddGift from './AddGift';
import UpdateGift from './UpdateGift';
import AddGiftIdea from './AddGiftIdea';
import UpdateGiftIdea from './UpdateGiftIdea';
import { UserProvider } from './UserContext';

const Stack = createStackNavigator();

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeAfterLogin" component={HomeScreenAfterLogin} options={{ headerShown: false }} />
          <Stack.Screen name="ContactList" component={ContactList} />
          <Stack.Screen name="CreateContact" component={CreateContact} />
          <Stack.Screen name="UpdateContact" component={UpdateContact} />
          <Stack.Screen name="ContactDetails" component={ContactDetails} />
          <Stack.Screen name="AddGift" component={AddGift} />
          <Stack.Screen name="UpdateGift" component={UpdateGift} />
          <Stack.Screen name="AddGiftIdea" component={AddGiftIdea} />
          <Stack.Screen name="UpdateGiftIdea" component={UpdateGiftIdea} />
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
