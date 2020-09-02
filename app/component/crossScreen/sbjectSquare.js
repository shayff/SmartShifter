import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

export default class sbjectSquare extends Component {

    render() {  
return (
    <View style={Styles.container}>
            <TouchableOpacity style={Styles.touchArea} onPress={()=>{this.props.fatherProps.navigation.navigate(this.props.nevTo)}}>
            <View style={Styles.line}>   
                    <View style={Styles.Center}>          
                        <MaterialIcons name={this.props.Icon} size={40} color="black" />
                    </View> 
                    <View style={Styles.Center}> 
                        <Text style={Styles.Text}>{this.props.titelName}</Text>
                    </View> 
                </View>
            </TouchableOpacity>
    </View>
);




}
}

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
    touchArea: {
        textAlign: 'center',
        width: 300,
        height: 50,
        backgroundColor: '#638cb0',
    },
    line:
    {
    alignItems: 'center',
    flexDirection : 'row',
    paddingTop: 10,
    backgroundColor:'#638cb0',// צבע רגע של השורה
    },
    Center:
    {
        alignItems: 'stretch',
        paddingLeft:30,
        backgroundColor:"#638cb0",
        
    },

})