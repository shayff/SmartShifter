import React, {Component} from 'react';
import { ActivityIndicator,AsyncStorage ,StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import member_server from '../../networking/member_server';

/*
Login_screen
*/

export default class LoginForm extends Component {
  constructor(inside){
    super(inside);
    this.state = {
        userName:'',
        password:0,
        isCheckData : false,
    }
  }
  
  check_password= () =>
  {
    if (this.state.password.length >= 5)
    {
      return true;
    }
    else return false;
  }

  confirm_input_data_user = () =>
  {
    if (this.check_password())
    {
      let data_send = {
      email: this.state.userName,
      password: this.state.password
      };
      this.setState({isCheckData:true});
      this.get_from_server(data_send);
    }
    else
    {
      Alert.alert('The password need to be at least 5 char');
    }
  }

get_from_server = async (data_send) =>
{
  try{
    const response = await member_server.post('/api/v1/login',data_send);
    let company='';
    if(response.data.data["company"] == null)
    {
      company= 'null';
    }
    else
    {
      company= response.data.data["company"].toString();
    }
    let keys = [['token', response.data.data.token],['company',company],['name', response.data.data["first_name"]],['can_employee_switch_shifts',response.data.data["can_employee_switch_shifts"].toString()],['_id',response.data.data["_id"].toString()],['password',this.state.password.toString()]];
    await AsyncStorage.multiSet(keys, () => {
    });

    this.setState({isCheckData:false});
    this.props.fatherProps.navigation.navigate('Cross_screen');
  }catch(err){
      Alert.alert(err.response.data.msg);
      this.setState({isCheckData:false});
  }
}

save_input_user_name = (val) =>
{
  this.state.userName = val;
}

save_input_password = (val) =>
{
  this.state.password = val;
}
    render() {  
        return(
            <View  style={Styles.container}>
                <StatusBar barStyle="light-content"/>

                <TextInput keyboardType="email-address" returnKeyType="next" placeholder="username (Email)" style={Styles.input} onChangeText={this.save_input_user_name} />
                <TextInput  returnKeyType="go" secureTextEntry placeholder="password" style={Styles.input} onChangeText={this.save_input_password} />

                <TouchableOpacity style={Styles.loginContainer}>
                    <Text style={Styles.textLogin} onPress={this.confirm_input_data_user}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.singupContainer}>
                    <Text style={Styles.textSighUp} onPress={()=>{this.props.fatherProps.navigation.navigate('Registration');}}>Sign Up</Text>
                </TouchableOpacity>

                <View>
                {this.state.isCheckData ? (
                                <View>
                                  <ActivityIndicator  size="large" color="#0000ff" />
                                </View>
                                    ): null}
                </View>
            
            </View>
        );
    }
    }

    
const Styles = StyleSheet.create({
  container:
  {
    padding: 20,
  },
  singupContainer:
  {
    paddingVertical: 10,
  },
  loginContainer: 
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
