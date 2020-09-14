import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View,  TouchableOpacity, Alert} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import meneger_server from '../../networking/shiftManager_server';

/*
The shift change button appears only next to the logged on user name when it appears on the shift.
After pressing the button, the button becomes inactive.
*/

export default class SingleShift extends Component {
    
    constructor(inside){
        super(inside);
        this.state = {
            employees : this.props.item.employees,
            _id : "",
            isSendSwap: false,
            canSwitch:false,
        }                      
    }

    componentDidMount = async () => {
        //Initializing variables
        let my_id = await AsyncStorage.getItem('_id');
        let isTrueSet = ('true' == await AsyncStorage.getItem('can_employee_switch_shifts'));
        this.setState({canSwitch:isTrueSet});
        this.setState({isSendSwap:this.props.item["is asked swap"]});
        this.setState({_id:my_id});
    }

    //Communication with the server
    ask_shift_swap = async () =>
    {
        let toSend = {
            "shift_id": Number(this.props.item.id)
        }
        let token = await AsyncStorage.getItem('token');
        const response = await meneger_server.post('/api/v1/shifts_swaps',
        toSend,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(response => {
            this.setState({isSendSwap:true});
            return  response.data;
        }).catch(err => {
            Alert.alert("something went wrong, please try again");
        });
    }

    render() { 
        return (

            <View style={Styles.itemSet}>
                <View style={Styles.titleLine}>
                    <Text style={Styles.title}>Type of job: </Text>
                    <Text style={Styles.secendTitle}>{this.props.item.title}</Text>
                </View>

                <View style={Styles.line}>
                    <Text style={Styles.title}>Start time: </Text>
                    <Text style={Styles.secendTitle}>{this.props.item["start time"]}</Text>
                </View>

                <View style={Styles.line}>
                    <Text style={Styles.title}>End time: </Text>
                    <Text style={Styles.secendTitle}>{this.props.item["end time"]}</Text>
        
                </View>
                <View>
                    <Text style={Styles.title}>Employees:</Text>
                        <View>
                            { this.state.employees.map( item => (
                                <View key = {item._id} style={Styles.line}>
                                    <Text style={Styles.username}>{item["first name"]} {item["last name"]}</Text>

                                    <View>{ this.state.canSwitch ? (this.state._id == item._id ?
                                            <View style={Styles.screenContainer} >
                                                <TouchableOpacity style={this.state.isSendSwap ? Styles.appButtonContainer_disable : Styles.appButtonContainer} disabled={this.state.isSendSwap} onPress={this.ask_shift_swap}>
                                                    <MaterialIcons name="swap-horiz" size={30} color="black" />
                                                    <Text style={Styles.appButtonText}>{'swap'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :null):null}
                                    </View>

                                </View>
                            ))}
                        </View>
                </View>
            </View>
        );
    }
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
    username:
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
    appButtonContainer_disable: {
        elevation: 3,
        backgroundColor: "#c0c0c0",
        borderRadius: 10,
        width:85,
        position: 'relative', justifyContent: 'center', alignItems: 'center',
        top: 0, left: 170, right: 10,       
        flexDirection : 'row',

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
});