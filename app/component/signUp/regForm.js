import React, {Component} from 'react';
import {StyleSheet, Text, View,TextInput, TouchableOpacity, Alert,ScrollView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
//import serverApi from '/Users/BENEDIK/Desktop/app/SmartShifter/app/networking/Server'
//import DatePicker from 'react-native-datepicker';
import member_server from '../../networking/member_server';

export default class Regform extends Component {

    constructor(inside){
      super(inside);
      this.state = {
          firstName:'',
          lastName:'',
          address:'',
          ID:'',
          phoneNumber:'',
          email:'',
          password:'',
          confirmePassword:'',
          dateBirth:'',
          gender:''
      }
    }
    check_input_user = () =>
    {
      if (this.state.password.length >= 5 && this.state.ID >=8) // correct email && all the form neet to be full
      {
        if (this.state.password == this.state.confirmePassword)
        {
           let dataSend = {
             "email" : this.state.email,
             "password":this.state.password,
             "id number":this.state.ID,
             "phone":this.state.phoneNumber,
             "first name":this.state.firstName,
             "last name":this.state.lastName,
             "address":this.state.address,
             "date of birth":this.state.dateBirth, // need to add to screen
             "gender":this.state.gender, // need to add to screen
           };

           this.send_to_server(dataSend);
        }
        else
        {
          Alert.alert('Your passwords not equal');
        }
      }
      else
      {
        Alert.alert('The password need to be at least 5 char AND the ID need be at least 8');
      }

    }  

    send_to_server = async (data_send) =>
  {
    try{
      const response = await member_server.post('/register',data_send);
      Alert.alert("you have successfully registered");
      this.props.fatherProps.navigation.navigate('Enter_Screen');
    }catch(err){
        Alert.alert(err.response.data.msg);
    }
  }


      render() {  
          return(
            <ScrollView  style={Styles.container}>
            <ScrollView>
                    <TextInput style={Styles.TextInputUser} placeholder="Last name" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.lastName = val}/>
                    <TextInput style={Styles.TextInputUser} placeholder="First name" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.firstName = val} />
                
                    <TextInput  style={Styles.TextInputUser} placeholder="Date of birth (YYYY-MM-DD)"  underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.dateBirth = val} />
                    <TextInput  style={Styles.TextInputUser} placeholder="Male/Female"  underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.gender = val} />

                    <TextInput style={Styles.TextInputUser} placeholder="Full address" underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.address = val} />
                    <TextInput style={Styles.TextInputUser} placeholder="ID number"  underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.ID = val} />
                
                    <TextInput style={Styles.TextInputUser} placeholder="Phone number"  underlineColorAndroid={'transparent'}  onChangeText={(val) => this.state.phoneNumber = val} />
                    <TextInput  style={Styles.TextInputUser} placeholder="Email"  keyboardType={'email-address'} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.email = val} />

                    <TextInput style={Styles.TextInputUser} placeholder="password" secureTextEntry={true} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.password = val} />
                    <TextInput style={Styles.TextInputUser} placeholder="Enter password to confirm" secureTextEntry={true} underlineColorAndroid={'transparent'} onChangeText={(val) => this.state.confirmePassword = val} />
                  
            </ScrollView>

                <View>
                  <TouchableOpacity style={Styles.touchUP}>
                    <Text style={Styles.btnUP} onPress={this.check_input_user}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
      TextInputUser:
      {
        height: 30,
        marginBottom:30,
        color: '#fff',
        borderBottomColor:'#f8f8f8',
        borderBottomWidth:1,
        textAlign: 'center',
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
        fontWeight: 'bold',
        color: '#ffff',
        alignSelf:'stretch',
        alignSelf:'center',
        padding:20,


      },
      touchUP:
      {
        backgroundColor:'#1d9aad',

      }
    
      });