import React, {Component} from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View,TextInput, TouchableOpacity,KeyboardAvoidingView,Keyboard, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


export default class Regform extends Component {

    constructor(inside){
      super(inside);
      this.state = {
          firstName:'',
          lastName:'',
          address:'',
          ID:0,
          phoneNumber:0,
          email:'',
          password:0,
          confirmePassword:0
      }
    }
    check_input_user = () =>
    {
      if (this.state.password.length >= 3) // correct email && all the form neet to be full
      {
        if (this.state.password == this.state.confirmePassword)
        {
          this.props.fatherProps.navigation.navigate('Cross_screen');
        }
        else
        {
          Alert.alert('Your passwords not equal');
        }
      }
      else
      {
        Alert.alert('The password need to be at least 3 char');
      }

    }  

      render() {  
          return(
            <View  style={Styles.container}>
            <KeyboardAvoidingView behavior="padding">
             
                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Last name" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.lastName = val}/>
                    
                    <TextInput style={Styles.firstTextInput} placeholder="First name" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.firstName = val} />
                </View>

                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Full address" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.address = val} />
                    <TextInput style={Styles.firstTextInput} placeholder="ID number" keyboardType={'numeric'} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.ID = val} />
                </View>
                
                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="Phone number" keyboardType={'numeric'} underlineColorAndroid={'transparent'}  onChangeText={(val) => this.state.phoneNumber = val} />
                    <TextInput  style={Styles.firstTextInput} placeholder="Email"  keyboardType={'email-address'} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.email = val} />
                </View>

                <View style={Styles.line}>
                    <TextInput style={Styles.secendTextInput} placeholder="password" secureTextEntry={true} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.password = val} />
                    <TextInput style={Styles.firstTextInput} placeholder="Enter password to confirm" secureTextEntry={true} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.confirmePassword = val} />
                </View>
                  

            </KeyboardAvoidingView>
                <View>
                  <TouchableOpacity style={Styles.touchUP}>
                    <Text style={Styles.btnUP} onPress={this.check_input_user}>Sign Up</Text>
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