import React, {Component} from 'react';
import {StyleSheet, Text, View, Image,ScrollView } from 'react-native';
import Regform from '../component/signUp/regForm';

export default class SignUp extends Component {

    render() {  
        return(
           <View style={Styles.container}>           
                <View style={Styles.logo_container}>
                    <Image style={Styles.image} source={require('../component/login/images/Logo_w.png')}/>
                    <Text style={Styles.smallTitle, Styles.smallTitle}>Happy to see you joining</Text>
                </View>

                <ScrollView >
                    <View style={Styles.reg}>
                        <Regform fatherProps={this.props}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    logo_container:
    {
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    smallTitle:
    {
        color: '#fff',
        opacity: 0.7,
    },
    image:
    {
        width: 100,
        height: 100,
    },
    container:
    {
        flex:1,
        backgroundColor:'#36485f',
    },
    reg:
    {
        paddingTop : 20,
        backgroundColor: '#486180',
    },
    smallTitle:
    {
        color: '#fff',
        paddingBottom:10,
    },
    logo_container:
    {
        alignItems: 'center',
        justifyContent: 'center',       
    },
});


