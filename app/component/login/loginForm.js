import React, {useState, Component} from 'react';
import { StyleSheet,Alert, Text, View, TextInput,TouchableOpacity, KeyboardAvoidingView,StatusBar } from 'react-native';

export default class LoginForm extends Component {

    
  constructor(inside){
    super(inside);
    this.state = {
        userName:'',
        password:0
    }
  }
  
  check_password()
  {
    if (this.state.password.length > 3)
    {
      return true;
    }
    else {return false;}
  }

  confirm_input_data_user()
  {
    
    if (this.check_password())
    {
      console.log('password in good go to check data');
    }
    else
    {
      Alert.alert('oops','the gole need to be atlist 3 char');
    }

  }


  save_input_user_name = (val) =>
  {
    this.state.userName = val;
  }

  save_input_password = (val) =>
  {
    this.state.password=val;
  }


    render() {  
        return(
            
            <View  style={Styles.container}>
                <StatusBar barStyle="light-content"/>

                <TextInput keyboardType="email-address" returnKeyType="next" placeholder="username (Email)" style={Styles.input} onChangeText={this.save_input_user_name} />
                <TextInput  returnKeyType="go" secureTextEntry placeholder="password" style={Styles.input} onChangeText={this.save_input_password} />

                <TouchableOpacity style={Styles.LOGINContainer}>
                    <Text style={Styles.textLogin} onPress={this.confirm_input_data_user}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.SIGNUPContainer}>
                    <Text style={Styles.textSighUp}>Sign Up</Text>
                </TouchableOpacity>
            
            </View>
        );
    }
    }

    
    const Styles = StyleSheet.create({

    container:
    {
     padding: 20,
     
    },
    SIGNUPContainer:
    {
     
        paddingVertical: 10,
    },
    LOGINContainer: 
    {
        backgroundColor: '#2980b9',
        paddingVertical: 10,
    },
    textSighUp:
    {
        textAlign: 'center',
        color: '#FFF',
        fontWeight:'700',
        opacity:0.6,
        
        
    },
    textLogin:
    {
        textAlign: 'center',
        color: '#FFF',
        fontWeight:'700',
    },
    input:
    {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#fff',
        paddingHorizontal: 10,
    },
    });


