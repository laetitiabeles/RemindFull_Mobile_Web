import React from 'react';
import { Button, View, Text } from 'react-native';

function HomeScreenAfterLogin({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to your Home Page</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Contacts"
          onPress={() => navigation.navigate('ContactList')}
        />
      </View>
    </View>
  );
}

export default HomeScreenAfterLogin;
