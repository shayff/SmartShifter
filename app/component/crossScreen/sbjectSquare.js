import React, {Component} from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View,TextInput, TouchableOpacity,KeyboardAvoidingView,Keyboard, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';



export default class sbjectSquare extends Component {

    render() {  
return (
    <View style={Styles.container}>
            <TouchableOpacity style={Styles.touchArea} onPress={()=>{this.props.fatherProps.navigation.navigate(this.props.nevTo)}}>
                <Text style={Styles.Text}>{this.props.titelName}</Text>
            </TouchableOpacity>
    </View>
);




}
}

const Styles = StyleSheet.create({

Text: {
    alignSelf:'center',
    color: '#ffff'
},
container:
{
    backgroundColor: '#2980b9',
    borderWidth: 1,
    borderRadius: 10,
},
touchArea: {
    textAlign: 'center',
    width: 140,
    height: 100,
    backgroundColor: '#2980b9',
}

})