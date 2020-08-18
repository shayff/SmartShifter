import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '../../node_modules/@expo/vector-icons';


export default function SwapSingle(promp) {

    const [isRead, SetIsRead] = useState(false);
    const ifWaitToSwap = () => promp.item.status !== 'wait_for_swap';
 



return (

 
    <View style={Styles.itemSet}>
        <View>
            <View style={Styles.line}>
                <Text style={Styles.title}>Date: </Text>
                <Text style={Styles.secendTitle}>{promp.item.date}</Text>
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>start time: </Text>
                <Text style={Styles.secendTitle}>{promp.item.start_time}</Text>
    
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>end time: </Text>
                <Text style={Styles.secendTitle}>{promp.item.end_time}</Text>
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>Who asks: </Text>
                <Text style={Styles.secendTitle}>{promp.item.Who_asks}</Text>
            </View>

        </View>

        <View style={Styles.buttonStyle}>
            <TouchableOpacity  style={Styles.line} disabled={ifWaitToSwap()} >
        
                <MaterialIcons name="autorenew" size={30} color="black" />
                <Text style={Styles.textStyle}>
                        Swap
                </Text>           
    
            </TouchableOpacity>
        </View>
        
    </View>

 
);


}

const Styles = StyleSheet.create({
   
    
    line:
    {
        flexDirection : 'row',
    },
    title:
    {
        color: '#ffff',
        fontSize:14,
        fontWeight: 'bold',
    },
    secendTitle:
    {
        color:'#ffff',
        opacity:0.7,
        fontSize: 14,
    },
    itemSet:
    {
        backgroundColor:'#638cb0',
        width:350,
        height:110,
        flexDirection : 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 13,
        marginVertical: 4,
        padding: 20, 
    },
    textStyle: {
        padding: 1,
        fontSize:18,
    },
    buttonStyle:{
        borderWidth:1,
        backgroundColor: 'darkgray',
        marginTop:15,
        marginLeft:80,
        borderRadius:10,
        flexDirection : 'row',
        height:45,   
        position: 'absolute', top: 15, left: 160, right: 10, justifyContent: 'center', alignItems: 'center'     
    },


})