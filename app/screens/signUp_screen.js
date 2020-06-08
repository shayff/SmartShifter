import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image, Keyboard ,TouchableWithoutFeedback } from 'react-native';
import Regform from '../component/signUp/regForm';
import global_styles from '../global/global_styles';

export default class SignUp extends Component {

    render() {  
        return(
            

            <View style={Styles.container}>

                <View style={global_styles.logo_container}>
                <Image style={global_styles.image} source={require('../component/login/images/pngguru.com.png')}/>
                <Text style={global_styles.smallTitle, Styles.smallTitle}>Happy to see you joining</Text>
                </View>

                <View style={Styles.reg}>
                    <Regform fatherProps={this.props}/>
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
        paddingLeft:12,
        paddingRight:12,
        
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

});


