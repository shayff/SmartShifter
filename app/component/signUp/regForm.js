import React, {Component} from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View,TextInput, TouchableOpacity,KeyboardAvoidingView,Keyboard } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default class Regform extends Component {

    constructor(inside){
      super(inside);
      this.state = {
          firstName:'',
          lestName:'',
          address:'',
          ID:0,
          phoneNumber:0,
          email:'',
          password:0
      }
    }
    confirm_input_data_user = () =>
    {

      
    }  

      render() {  
          return(
            <View  style={Styles.container}>
            <KeyboardAvoidingView behavior="padding">
             
                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Lest name" underlineColorAndroid={'transparent'} />
                    
                    <TextInput style={Styles.firstTextInput} placeholder="First name" underlineColorAndroid={'transparent'} />
                </View>

                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Full address" underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.firstTextInput} placeholder="ID number" keyboardType={'numeric'} underlineColorAndroid={'transparent'} />
                </View>
                
                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Phone number" keyboardType={'numeric'} underlineColorAndroid={'transparent'} />
                    <TextInput  style={Styles.firstTextInput} placeholder="Email"  keyboardType={'email-address'} underlineColorAndroid={'transparent'}/>
                </View>

                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="password" secureTextEntry={true} underlineColorAndroid={'transparent'} />
                    <TextInput style={Styles.firstTextInput} placeholder="Enter password to confirm" secureTextEntry={true} underlineColorAndroid={'transparent'} />
                </View>
                  

            </KeyboardAvoidingView>
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
      line:
      {
        flexDirection : 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between'
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
      secendTextInput:
      {
        paddingLeft:80,
        height: 30,
        marginBottom:30,
        color: '#fff',
        borderBottomColor:'#f8f8f8',
        borderBottomWidth:1,
      },
      firstTextInput:
      {
        paddingRight:80,
        height: 30,
        marginBottom:30,
        color: '#fff',
        borderBottomColor:'#f8f8f8',
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