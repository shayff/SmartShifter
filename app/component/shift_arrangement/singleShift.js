import React, {useState, Component} from 'react';
import { StyleSheet, Text, View,  TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


export default function SingleShift(promp) {

    
    const [employees, SetEmployees] = useState(promp.item.employees);

    let myId=12;
    let ButtonStateHolder=true;
      

return (

    <View style={Styles.itemSet}>
        <View style={Styles.titleLine}>
            <Text style={Styles.title}>Type of job: </Text>
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
                        <View key = {item._id} style={Styles.line}>
                            <Text style={Styles.nameEMP}>{item["first name"]} {item["last name"]}</Text>
                            <View style={Styles.screenContainer} >
                                
                                <TouchableOpacity style={Styles.appButtonContainer} disabled = {false}  >
                                    <MaterialIcons name="swap-horiz" size={30} color="black" />
                                    <Text style={Styles.appButtonText}>{'swap'}</Text>
                                </TouchableOpacity>
                            </View>
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
    nameEMP:
    {
        color:'#ffff',
        opacity:0.7,
        fontSize: 14,
        paddingLeft:10
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
    },
    appButtonContainer: {
        elevation: 3,
        backgroundColor: "#009688",
        borderRadius: 10,
        width:85,
        position: 'relative', justifyContent: 'center', alignItems: 'center',
        top: 0, left: 170, right: 10,       
        flexDirection : 'row',

      },
      appButtonText: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }

})