import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SignUpScreen from './SignUp';
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
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="HomeAfterLogin" component={HomeScreenAfterLogin} options={{ headerShown: false }} />
          <Stack.Screen name="ContactList" component={ContactList} options={{ headerShown: false }} />
          <Stack.Screen name="CreateContact" component={CreateContact} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateContact" component={UpdateContact} options={{ headerShown: false }} />
          <Stack.Screen name="ContactDetails" component={ContactDetails} options={{ headerShown: false }} />
          <Stack.Screen name="AddGift" component={AddGift} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateGift" component={UpdateGift} options={{ headerShown: false }} />
          <Stack.Screen name="AddGiftIdea" component={AddGiftIdea} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateGiftIdea" component={UpdateGiftIdea} options={{ headerShown: false }} />
          <Stack.Screen name="TaskList" component={TaskList} options={{ headerShown: false }} />
          <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: false }}/>
          <Stack.Screen name="UpdateTask" component={UpdateTask} options={{ headerShown: false }} />
          <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
