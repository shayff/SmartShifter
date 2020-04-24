import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import User_registration from '../component/comp_enter_screen/user_registration';

class Enter_screen extends Component {



  render() {  
        return(
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <View>
                <User_registration/>
            </View>
        </TouchableWithoutFeedback>
      );
  }


}

export default Enter_screen;
