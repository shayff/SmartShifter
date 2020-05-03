import React, {Component} from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View,TextInput, TouchableOpacity, } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default class Regform extends Component {

    constructor(inside){
      super(inside);
      this.state = {
          userName:'',
          password:0
      }
    }

      render() {  
          return(
              
              <View  style={Styles.container}>
                <View>
                  
                    <TextInput style={Styles.textInput} placeholder="First name" underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.textInput} placeholder="Lest name" underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.textInput} placeholder="Full address" underlineColorAndroid={'transparent'} />

                    <TextInput style={Styles.textInput} placeholder="ID number" keyboardType={'numeric'} underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.textInput} placeholder="Phone number" keyboardType={'numeric'} underlineColorAndroid={'transparent'} />
                    <TextInput  style={Styles.textInput} placeholder="Email"  keyboardType={'email-address'} underlineColorAndroid={'transparent'}/>

                    <TextInput style={Styles.textInput} placeholder="password" secureTextEntry={true} underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.textInput} placeholder="Enter password to confirm" secureTextEntry={true} underlineColorAndroid={'transparent'} />
                  
                </View>

                <View>
                  <TouchableOpacity style={Styles.touchUP}>
                    <Text style={Styles.btnUP}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              
              </View>
          );
      }
      }
  
      
      const Styles = StyleSheet.create({
  
      container:
      {
       alignSelf: 'stretch',
       
      },
      header:
      {
        fontSize:24,
        color: '#fff',
        paddingBottom:10,
        marginBottom:40,
        borderBottomColor: '#199187',
        borderBottomWidth:1,
      },
      textInput:
      {
        alignSelf:'stretch',
        height: 30,
        marginBottom:30,
        color: '#fff',
        borderBottomColor:'#f8f8f8',
        borderBottomWidth:1,

      },
      btnUP:
      {
        alignSelf:'stretch',
        alignSelf:'center',
        padding:20,
      },
      touchUP:
      {
        backgroundColor:'#59cbbd',

      }
    
      });