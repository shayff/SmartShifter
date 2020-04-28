import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image, Keyboard } from 'react-native';
import LoginForm from '../component/login/loginForm';

export default class Login extends Component {

    render() {  
        return(
            
            <View style={Styles.container}>
                <View style={Styles.bigTitleView}>
                <Text style={Styles.bigTitle}>SmartShifter</Text>
                </View>
                <View style={Styles.logo_container}>
                <Image style={Styles.image} source={require('../component/login/images/pngguru.com.png')}/>
                <Text style={Styles.smallTitle}>Make It Simple</Text>
                </View>
                <View>
                    <LoginForm fatherProps={this.props}/>
                </View>
            </View>
        
        );
    }
    }

    
    const Styles = StyleSheet.create({

    container:
    {
        flex:1,
        backgroundColor:'#3498db',
    },
    smallTitle:
    {
        color: '#fff',
        opacity: 0.7,
    },
    bigTitleView:
    {
        alignItems: 'center',

    },
    bigTitle:
    {
        color: '#fff',
        fontSize:30,
        opacity: 0.8,
    },
    logo_container:
    {
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    image:
    {
        width: 100,
        height: 100,
    }
    
    });


