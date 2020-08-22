import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import LoginForm from '../component/login/loginForm';


export default class Login extends Component {

    render() {  
        return(
            
            <View style={Styles.container}>
                <View style={Styles.bigTitleView}>
                <Text style={Styles.bigTitle}>Smart Shifter</Text>
                </View>
                <View style={Styles.logo_container}>
                <Image style={Styles.image} source={require('../component/login/images/logo.png')}/>
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
        backgroundColor:'#36485f',
    },
    smallTitle:
    {
        color: '#fff',
        opacity: 0.7,
        paddingTop:8,

    },
    bigTitleView:
    {
        paddingTop:15,
        alignItems: 'center',

    },
    bigTitle:
    {
        color: '#fff',
        fontSize:25,
        opacity: 1,
    },
    logo_container:
    {
        paddingTop:10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:10,
       
    },
    image:
    {
        width: 100,
        height: 100,
    }
    
    });


