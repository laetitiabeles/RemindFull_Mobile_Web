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


const Stack = createStackNavigator();

// Main App

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="HomeAfterLogin" component={HomeScreenAfterLogin} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="CreateContact" component={CreateContact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;