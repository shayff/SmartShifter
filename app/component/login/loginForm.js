import React, {useState, Component} from 'react';
import { ActivityIndicator,AsyncStorage ,StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, StatusBar } from 'react-native';
import member_server from '../../networking/member_server';


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
    if (this.state.password.length >= 5) // correct email
    {
      return true;
    }
    else {return false;}
  }

  confirm_input_data_user = () =>
  {
    
    if (this.check_password())
    {
      console.log('password in good go to check data');
      let data_send = {
        email: this.state.userName,
        password: this.state.password
      };
      this.setState({isCheckData:true});
      let res = this.get_from_server(data_send);


    }
    else
    {
      Alert.alert('The password need to be at least 5 char');
    }

  }

get_from_server = async (data_send) =>
{
  try{
    const response = await member_server.post('/login',data_send);
    let keys = [['token', response.data.data.token],['name', response.data.data["first name"]],['id',response.data.data["id number"]],['password',this.state.password.toString()]];
    await AsyncStorage.multiSet(keys, () => {

    });


    //await AsyncStorage.setItem('dataUser',JSON.stringify(response.data.data));
    //await AsyncStorage.setItem('name',response.data.data[first name]);
    this.setState({isCheckData:false});

    this.props.fatherProps.navigation.navigate('Cross_screen');
  }catch(err){
      if(err.response.data == 400)
      {
        Alert.alert("You entered incorrect parameters");
      }
      else // is 401
      {
        Alert.alert("One of the data is incorrect or you are not registered in the system");
      }
      this.setState({isCheckData:false});
      console.log(err.response.data);
      console.log(err.response.status); // 400 401 // לטפל בבעיות
    
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

                <TouchableOpacity style={Styles.LOGINContainer}>
                    <Text style={Styles.textLogin} onPress={this.confirm_input_data_user}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Styles.SIGNUPContainer}>
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


