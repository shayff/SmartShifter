import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SubjectButton from '../component/crossScreen/sbjectSquare';

export default class Cross_screen extends Component {

  render() {  
        return(
        <View>
            <View> 
              <SubjectButton fatherProps={this.props} titelName= {'1. User preferences'}  nevTo = {'User_preferences'}/>
              <SubjectButton fatherProps={this.props} titelName= {'2. Weekly shift arrangement'}  nevTo = {'Weekly_shift_arrangement'}/>
              <SubjectButton fatherProps={this.props} titelName= {'3. Switching shifts'}  nevTo = {'Switching_shifts'}/>
              <SubjectButton fatherProps={this.props} titelName= {'4. Messages'}  nevTo = {'Messages'}/>
            </View>
        </View>
      );
  }


}