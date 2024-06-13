import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateContact from './CreateContact';
import ContactList from './ContactList';
import UpdateContact from './UpdateContact';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the Contact App</Text>
      <Button
        title="Create Contact"
        onPress={() => navigation.navigate('CreateContact')}
      />
      <Button
        title="Contact List"
        onPress={() => navigation.navigate('ContactList')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="CreateContact" component={CreateContact} options={{ title: 'Create Contact' }} />
        <Stack.Screen name="ContactList" component={ContactList} options={{ title: 'Contact List' }} />
        <Stack.Screen name="UpdateContact" component={UpdateContact} options={{ title: 'Update Contact' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
