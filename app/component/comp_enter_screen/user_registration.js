import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class User_registration extends Component {

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
            
            <View style={Styles.all_input}>
                <View>
                    <View style={Styles.enter_input_data}>
                        <TextInput placeholder=" Email address " onChangeText={this.save_input_user_name} style={Styles.input} />
                        <Text style={Styles.onlyTitle}>User Name: </Text>
                    </View>
                    <View style={Styles.enter_input_data}>
                        <TextInput placeholder="        *******        " onChangeText={this.save_input_password} style={Styles.input} />
                        <Text style={Styles.onlyTitle}>Password: </Text>
                    </View>
                </View>
                <View>
                    <Button onPress={this.confirm_input_data_user} title="Enter"/>
                </View>
            </View>
       
      );
  }
}


   const Styles = StyleSheet.create({

    enter_input_data:
    {
    padding: 16,
    borderColor: '#bbb',
    flexDirection:'row',
    alignItems:'center',
    },
    input: {
        borderColor: '#bbb',
        borderWidth: 2,
        borderRadius: 10,
        borderColor:'#4DA6FF',
    },
    onlyTitle: {
    
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffff'
      },
    all_input:
    {
      backgroundColor:'#367fff',
        borderColor: '#bbb',
        borderWidth:10,
        width:'100%',
        alignItems:'center',
    }
    
    });
