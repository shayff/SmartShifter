import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, CheckBox, FlatList, TouchableOpacity } from 'react-native';


export default function SingleMessage(promp) {

    const [isRead, SetIsRead] = useState(false);


return (

    <View style={Styles.itemSet}>
        <View style={Styles.titleLine}>
            <Text style={Styles.title}>Title: </Text>
            <Text style={Styles.secendTitle}>{promp.item.title}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Date: </Text>
            <Text style={Styles.secendTitle}>{promp.item.time_created}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Sender Name: </Text>
            <Text style={Styles.secendTitle}>{promp.item.name_sender}</Text>
 
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Content: </Text>
            <Text style={Styles.secendTitle}>{promp.item.massege}</Text>
        </View>

        {/* <View style={Styles.line}>
            <Text style={Styles.title}>Mark to verify reading: </Text>
            <CheckBox value = {isRead} onChange = {()=>{SetIsRead(!isRead)}}/>
        </View> */}

    </View>
    

);




}

const Styles = StyleSheet.create({
    titleLine:
    {
        flexDirection : 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        textDecorationLine: 'underline',
        paddingBottom: 16,

    },
    secendTitle:
    {
        color:'#ffff',
        opacity:0.7,
        fontSize: 14,
    },
    line:
    {
        flexDirection : 'row',
        alignItems: 'stretch',
    },
    title:
    {
        color: '#ffff',
        fontSize:14,
        fontWeight: 'bold',
    },
    itemSet:
    {
        backgroundColor:'#638cb0',
        padding: 16,
        borderWidth: 2,
        borderRadius: 10,
    }

})