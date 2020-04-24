import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Cross_screen extends Component {

  render() {  
        return(
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <View >
                <Text>cross screen</Text>
            </View>
        </TouchableWithoutFeedback>
      );
  }


}