
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Enter_screen from '../screens/enter_screen';
import Cross_screen from '../screens/cross_screen';

const Stack = createStackNavigator()

export default function Navigator_stack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{
          title: 'Enter Screen',
          headerStyle: {
            backgroundColor: '#0048BA', 
          }, headerTintColor: '#fff',alignItems:'center',}} name='Home' component={Enter_screen} />
        <Stack.Screen name='ReviewDetails' component={Cross_screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}