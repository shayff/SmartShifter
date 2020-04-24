import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import User_registration from '../component/comp_enter_screen/user_registration';

export default class Enter_screen extends Component {



  render() {  
        return(
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <View style={Styles.user_input}>
                <User_registration/>
            </View>
        </TouchableWithoutFeedback>
      );
  }


}

const Styles = StyleSheet.create({

    user_input:
    {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#FF9999',
        borderWidth:10,
        flex: 1,
    },

        
    });
