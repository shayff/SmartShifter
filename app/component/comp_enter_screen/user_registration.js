import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class User_registration extends Component {

  constructor(inside){
    super(inside);
    this.state = {
        userName:'',
        password:0
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

  confirm_input_data_user = ()=>
  {
    Alert.alert('chack confirm to'+this.state.userName+'/n'+this.state.password);
  }
  

  render() {  
        return(
            
            <View>
                <View>
                    <TextInput placeholder="User Name (Email)" onChangeText={this.save_input_user_name}  />
                    <TextInput placeholder="Password" onChangeText={this.save_input_password}  />
                </View>
                <View>
                    <Button onPress={this.confirm_input_data_user} title="Enter"/>
                </View>
            </View>
       
      );
  }


}

const Styles = StyleSheet.create({

    itemSet: {
    padding: 16,
    borderColor: '#bbb',
    borderWidth: 6,
    borderRadius: 10
    
    
    }
    
    })

export default User_registration;