import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity  } from 'react-native';


export default function ToDoItemClass(promp) {

return (
    <View>
        <TouchableOpacity onPress={()=>promp.nev_to()}>
            <Text>boom</Text>
        </TouchableOpacity>
    </View>
);




}

const Styles = StyleSheet.create({

itemSet: {
padding: 16,
borderColor: '#bbb',
borderWidth: 6,
borderRadius: 10


}

})