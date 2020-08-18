import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, CheckBox, FlatList, TouchableOpacity } from 'react-native';


export default function SingleShift(promp) {

    const [employees, SetEmployees] = useState(promp.item.employees);


return (

    <View style={Styles.itemSet}>
        <View style={Styles.titleLine}>
            <Text style={Styles.title}>Title: </Text>
            <Text style={Styles.secendTitle}>{promp.item.title}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Start time: </Text>
            <Text style={Styles.secendTitle}>{promp.item["start time"]}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>End time: </Text>
            <Text style={Styles.secendTitle}>{promp.item["end time"]}</Text>
 
        </View>
         <View>
             <Text style={Styles.title}>Employees:</Text>
                <View>
                    { employees.map( item => (
                        <View key = {item._id}>
                            <Text style={Styles.secendTitle}>{item["first name"]}-{item["last name"]}</Text>
                        </View>

                    ))}

                </View>
        </View>

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