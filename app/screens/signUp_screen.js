import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image, Keyboard ,TouchableWithoutFeedback } from 'react-native';
import Regform from '../component/signUp/regForm';

export default class SignUp extends Component {

    render() {  
        return(
            <View  style={Styles.container}>
            <Regform style={Styles.reg}/>
            </View>
        
        );
    }
    }

    
    const Styles = StyleSheet.create({

    container:
    {
        flex:1,
        justifyContent:'center',
        backgroundColor:'#36485f',
        paddingLeft:12,
        paddingRight:12,
        
    },
    reg:
    {
        paddingTop:1000,
    }
  
    });


