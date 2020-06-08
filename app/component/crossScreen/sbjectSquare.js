import React, {Component} from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View,TextInput, TouchableOpacity,KeyboardAvoidingView,Keyboard, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';


export default class sbjectSquare extends Component {

    render() {  
return (
    <View>
            <TouchableOpacity>
                    <Text onPress={()=>{this.props.fatherProps.navigation.navigate(this.props.nevTo)}}>{this.props.titelName}</Text>
            </TouchableOpacity>
    </View>
);




}
}

const Styles = StyleSheet.create({

itemSet: {
padding: 16,
borderColor: '#bbb',
borderWidth: 6,
borderRadius: 10


}

})