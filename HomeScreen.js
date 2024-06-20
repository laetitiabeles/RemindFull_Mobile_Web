import React from 'react';
import { Button, View, Text } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to RemindFull App</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="S'inscrire"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="Se connecter"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </View>
  );
}

export default HomeScreen;
