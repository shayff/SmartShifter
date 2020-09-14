import React, {Component} from 'react';
import {AsyncStorage ,StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native';
import { MaterialIcons } from '../../node_modules/@expo/vector-icons';
import shiftManager_server from '../../networking/shiftManager_server';

/*
Shift replacement message
*/

export default class SwapSingle extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            status_type:false,
            color:'',
            status_title:this.props.item.status,
            itMyShift:false,
        }
    }
    
    componentDidMount =  async () => {

        let _id = await AsyncStorage.getItem('_id');
        let strIDSwap= this.props.item.id_employee_ask.toString();

        //Organization of changing shifts according to statuses
        if(strIDSwap == _id)
        {
            this.setState({itMyShift:true});
            this.setState({color:'#deb887'});
        }
        else{
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
    }

    //Cancel shift replacement
    Delete_shift_swap= async() =>
    {
        let token = await AsyncStorage.getItem('token');
        let root='/api/v1/shift_swap/'+this.props.item.id;
        const response = await shiftManager_server.delete(root, {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        Alert.alert("something went wrong, please try again");
        this.props.navigation.goBack(null);
      });

      this.props.render_screen();

    }

    //Functionality in front of the server, in case of pressing the swap button
    if_wait_to_swap = async() =>
    {
        let toSend ={'swap_id':this.props.item.id}
        let token = await AsyncStorage.getItem('token');
        const response = await shiftManager_server.post('/api/v1/shifts_swaps/can_swap',toSend, {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        Alert.alert("something went wrong, please try again");
        this.props.navigation.goBack(null);
      });

      this.props.render_screen();
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
                marginTop:15,
                marginLeft:80,
                borderRadius:10,
                flexDirection : 'row',
                height:45,   
                position: 'absolute', top: 15, left: 160, right: 10, justifyContent: 'center', alignItems: 'center',flexDirection : 'row',backgroundColor:this.state.color }}>
                    {this.state.itMyShift ? (
                        <TouchableOpacity ref="tach" disabled= {this.state.status_type} style={Styles.line} onPress={this.Delete_shift_swap} >
                        <MaterialIcons name="autorenew" size={30} color="black" />
                        <Text style={Styles.textStyle}>
                                Cancel
                        </Text>           
                    </TouchableOpacity>
                    ):(
                    <TouchableOpacity ref="tach" disabled= {this.state.status_type} style={Styles.line} onPress={this.if_wait_to_swap} >
                        <MaterialIcons name="autorenew" size={30} color="black" />
                        <Text style={Styles.textStyle}>
                                Swap
                        </Text>           
                    </TouchableOpacity>
                    )}

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
})