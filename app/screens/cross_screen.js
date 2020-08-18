import React, {useState, Component} from 'react';
import { AsyncStorage,StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import SubjectButton from '../component/crossScreen/sbjectSquare';

export default class Cross_screen extends Component {
    constructor(inside){
      super(inside);
      this.state = {
          Name:'',

      }
    }

  componentDidMount(){
    this.get();
  }

  get = async (data_send) =>
  {
    let firstName = await AsyncStorage.getItem('name');
    let name = "welcome "+ firstName;
    this.setState({Name:name});
  }

  render() {  
        return(
        <View style={Styles.container}>

        <Text style={Styles.titelName}>{this.state.Name}</Text>

          <View style={Styles.line}>
               <View>
                    <SubjectButton fatherProps={this.props} titelName= {'User preferences'}  nevTo = {'User_preferences'}/>
                </View>
                <View  style={Styles.secendSubject}>
                    <SubjectButton fatherProps={this.props} titelName= {'Shift arrangement'}  nevTo = {'Weekly_shift_arrangement'}/>
                </View>
          </View>

          <View style={Styles.line}>
                <View>
                    <SubjectButton fatherProps={this.props} titelName= {'Switching shifts'}  nevTo = {'Switching_shifts'}/>
                </View>
                <View style={Styles.secendSubject}>
                   <SubjectButton fatherProps={this.props} titelName= {'Messages'}  nevTo = {'Messages'}/>
                </View>
          </View>

          <View style={Styles.line}>
                <View>
                    <SubjectButton fatherProps={this.props} titelName= {'Private Profile'}  nevTo = {'Private_profile'}/>
                </View>
          </View>

        </View>
      );
  }


}

const Styles = StyleSheet.create({
  line:
  {
    flexDirection : 'row',
    alignItems: 'stretch',
    paddingLeft: 25,
    paddingTop: 10,
    backgroundColor:'#36485f',
  },
  container:
  {
    flex:1,
    backgroundColor:'#36485f',
  },
  secendSubject: {
    paddingLeft:30,


  },
  titelName:
  {
    textAlign: 'center',
    color: "#ffff",
    fontSize:20,
  }
});