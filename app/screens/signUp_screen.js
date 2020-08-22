import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image, Keyboard ,TouchableWithoutFeedback,ScrollView } from 'react-native';
import Regform from '../component/signUp/regForm';
import global_styles from '../global/global_styles';

export default class SignUp extends Component {

    render() {  
        return(
            

           <View style={Styles.container}>           
                <View style={global_styles.logo_container}>
                <Image style={global_styles.image} source={require('../component/login/images/logo.png')}/>
                <Text style={global_styles.smallTitle, Styles.smallTitle}>Happy to see you joining</Text>
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
    container:
    {
        flex:1,
        backgroundColor:'#36485f',
        paddingLeft:12,
        paddingRight:12,
        
        paddingTop:15,
    },
    reg:
    {
        paddingTop : 30,
        backgroundColor: '#486180',
    },
    smallTitle:
    {
        color: '#fff',
    },
    logo_container:
    {
        paddingTop:10,
        alignItems: 'center',
        justifyContent: 'center',       
    },

});


