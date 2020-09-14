import React, {Component} from 'react';
import {StyleSheet, Text, View,TextInput, TouchableOpacity, Alert,ScrollView } from 'react-native';
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
      if (this.state.password.length >= 5 && this.state.ID >=8)
      {
        if (this.state.password == this.state.confirmePassword)
        {
           let dataSend = {
             "email" : this.state.email,
             "password":this.state.password,
             "id_number":this.state.ID,
             "phone":this.state.phoneNumber,
             "first_name":this.state.firstName,
             "last_name":this.state.lastName,
             "address":this.state.address,
             "date_of_birth":this.state.dateBirth,
             "gender":this.state.gender,
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
      const response = await member_server.post('/api/v1/user',data_send);///register///api/v1/user
      Alert.alert("you have successfully registered");
      this.props.fatherProps.navigation.navigate('Enter_Screen');
 

    }catch(err){
      Alert.alert("something went wrong, please try again");
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
          <TouchableOpacity style={Styles.areaRegisterButton}>
            <Text style={Styles.textRegisterButton} onPress={this.check_input_user}>Sign Up</Text>
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
  TextInputUser:
  {
    height: 30,
    marginBottom:30,
    color: '#fff',
    borderBottomColor:'#f8f8f8',
    borderBottomWidth:1,
    textAlign: 'center',
  },
  textRegisterButton:
  {
    fontWeight: 'bold',
    color: '#ffff',
    alignSelf:'stretch',
    alignSelf:'center',
    fontSize:20,
    padding:15,
  },
  areaRegisterButton:
  {
    backgroundColor:'#1d9aad',
  }
});