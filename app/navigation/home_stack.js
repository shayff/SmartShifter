
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Cross_screen from '../screens/cross_screen';
import Login from '../screens/login_screen';
import SignUp from '../screens/signUp_screen';

const Stack = createStackNavigator()

export default function Navigator_stack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Enter Screen' component={Login} />
        <Stack.Screen name='Cross screen' component={Cross_screen} />
        <Stack.Screen options={{ headerStyle:{backgroundColor: '#f8f8f8'}}} name='Registration' component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}