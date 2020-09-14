import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


/*
Button in the main menu
*/

export default class sbjectSquare extends Component {

    render() {  
return (
    <View style={ this.props.isLogOut ? (Styles.containerLogOut) : (Styles.container)}>
            <TouchableOpacity style={ this.props.isLogOut ? (Styles.buttonAreaLogOut) : (Styles.buttonArea)} onPress={()=>{this.props.fatherProps.navigation.navigate(this.props.nevTo)}}>
            <View style={ this.props.isLogOut ? (Styles.lineLogOut) : (Styles.line)}>
                    <View style={ this.props.isLogOut ? (Styles.CenterLogOut) : (Styles.Center)}>
                        <MaterialIcons name={this.props.Icon} size={40} color="black" />
                    </View> 
                    <View style={ this.props.isLogOut ? (Styles.CenterLogOut) : (Styles.Center)}> 
                        <Text style={Styles.Text}>{this.props.titelName}</Text>
                    </View> 
                </View>
            </TouchableOpacity>
    </View>
);
}}

const Styles = StyleSheet.create({

    Text: {
        alignSelf:'center',
        color: 'white',
        fontSize:18
    },
    container:
    {
        backgroundColor: '#2980b9',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 1,
        padding: 6, 
    },
    containerLogOut :
    {
        alignSelf:'center',
        backgroundColor: '#fa8072',
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 1,
        width:150,
        height:63,
        padding: 2, 
    },
    buttonArea: {
        textAlign: 'center',
        width: 300,
        height: 50,
    },
    buttonAreaLogOut: {
        textAlign: 'center',
        width:140,
        height:50,
        
    },
    line:
    {
        alignItems: 'center',
        flexDirection : 'row',
        paddingTop: 10,
        backgroundColor:'#638cb0',
    },
    lineLogOut: {
        alignItems: 'center',
        flexDirection : 'row',
        paddingTop: 10,
        backgroundColor:'#fa8072',
        
    },
    Center:
    {
        alignItems: 'stretch',
        paddingLeft:30,
        backgroundColor:"#638cb0",
    },
    CenterLogOut:
    {
        borderRadius: 10,
        paddingLeft:4,
        backgroundColor:"#fa8072",
        
        
    }
});