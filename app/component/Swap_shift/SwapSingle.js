import React, {useState, Component} from 'react';
import {AsyncStorage ,StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '../../node_modules/@expo/vector-icons';
import shiftManager_server from '../../networking/shiftManager_server';



export default class SwapSingle extends Component {

    constructor(inside){
        super(inside);
        this.state = {
        status_type:false,
        color:'#faf0e6',
        status_title:this.props.item.status,

      }
      
    }

    componentDidMount =  () => {

        if(this.state.status_title == "wait for swap")
        {
            this.setState({color:'#8fbc8f'});
        }
        if(this.state.status_title == "wait for confirm")
        {
            this.setState({status_type:true});
            this.setState({color:'#f08080'});

        }        
        if(this.state.status_title == "confirmed")
        {
            this.setState({status_type:true});
            this.setState({color:'#8fbc8f'});
        }
    }



    ifWaitToSwap = async() =>
    {
        this.setState({status_title:"wait for confirm"});
        this.setState({color:'#f08080'});

        let toSend ={'swap_id':this.props.item.id}
        let token = await AsyncStorage.getItem('token');
        const response = await shiftManager_server.post('/CanShiftSwap',toSend, {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        console.log("EROR "+err.response.data);

      });

    } 

    render() { 
return (
    <View style={Styles.itemSet}>
        <View>
            <View style={Styles.line_Status}>
                <Text style={Styles.title}>Status: </Text>
                <Text style={Styles.secendTitle}>{this.state.status_title}</Text>
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>Date: </Text>
                <Text style={Styles.secendTitle}>{this.props.item.date}</Text>
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>start time: </Text>
                <Text style={Styles.secendTitle}>{this.props.item.start_time}</Text>
    
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>end time: </Text>
                <Text style={Styles.secendTitle}>{this.props.item.end_time}</Text>
            </View>

            <View style={Styles.line}>
                <Text style={Styles.title}>Who asks: </Text>
                <Text style={Styles.secendTitle}>{this.props.item.Who_asks}</Text>
            </View>
        </View>

        <View style={{
        borderWidth:1,
        backgroundColor: 'darkgray',
        marginTop:15,
        marginLeft:80,
        borderRadius:10,
        flexDirection : 'row',
        height:45,   
        position: 'absolute', top: 15, left: 160, right: 10, justifyContent: 'center', alignItems: 'center',flexDirection : 'row',backgroundColor:this.state.color }}  >
            <TouchableOpacity ref="tach" disabled= {this.state.status_type} style={Styles.line} onPress={this.ifWaitToSwap} >
        
                <MaterialIcons name="autorenew" size={30} color="black" />
                <Text style={Styles.textStyle}>
                        Swap
                </Text>           
    
            </TouchableOpacity>
        </View>
        
    </View>

 
);

    }
}
const Styles = StyleSheet.create({
   
    line:
    {
        flexDirection : 'row',
    },
    line_Status:
    {
        flexDirection : 'row',
        fontSize:14,
        fontWeight: 'bold',
        paddingLeft:50,
        alignItems: 'center',
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
    // buttonStyle:{
    //     borderWidth:1,
    //     backgroundColor: 'darkgray',
    //     marginTop:15,
    //     marginLeft:80,
    //     borderRadius:10,
    //     flexDirection : 'row',
    //     height:45,   
    //     position: 'absolute', top: 15, left: 160, right: 10, justifyContent: 'center', alignItems: 'center'     
   // },


})