import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Cross_screen from '../screens/Cross_screen';
import Login from '../screens/Login_screen';
import SignUp from '../screens/SignUp_screen';
import User_preferences from '../screens/UserPreferences_screen';
import Messages from '../screens/Messages_screen';
import Switching_shifts from '../screens/Swap_screen';
import Weekly_shift_arrangement from '../screens/ShiftArrangement_screen';
import Private_profile from '../screens/Profile_screen';

const Stack = createStackNavigator()

export default function Navigator_stack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Enter_Screen' component={Login} options={{ title: 'Enter Screen'}}/>
        <Stack.Screen options={{ headerStyle:{backgroundColor: '#f8f8f8'}}} name='Registration' component={SignUp} />

        <Stack.Screen name='Cross_screen' component={Cross_screen} options={{ title: 'Home'}}/>
        <Stack.Screen name='Weekly_shift_arrangement' component={Weekly_shift_arrangement} options={{ title: 'Weekly Shift Arrangement'}}/>
        <Stack.Screen name='User_preferences' component={User_preferences} options={{ title: 'User Preferences'}}/>
        <Stack.Screen name='Messages' component={Messages} options={{ title: 'Messages'}}/>
        <Stack.Screen name='Switching_shifts' component={Switching_shifts} options={{ title: 'Switching Shifts'}}/>
        <Stack.Screen name='Private_profile' component={Private_profile} options={{ title: 'Private Profile'}}/>        

      </Stack.Navigator>
    </NavigationContainer>
  );
}