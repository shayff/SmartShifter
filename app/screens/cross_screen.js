import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SubjectButton from '../component/crossScreen/subjectButton'

export default class Cross_screen extends Component {

  render() {  
        return(
        <View>
            <View >
                <Text>cross screen</Text>
            </View>
            <View>
              <SubjectButton nev_to = {this.props.navigation.navigate('Enter Screen')}/>
            </View>
        </View>
      );
  }


}