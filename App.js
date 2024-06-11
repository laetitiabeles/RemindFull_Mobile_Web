import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateContact from './CreateContact';
import ContactList from './ContactList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CreateContact" component={CreateContact} options={{ title: 'Create Contact' }} />
        <Stack.Screen name="ContactList" component={ContactList} options={{ title: 'Contact List' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}