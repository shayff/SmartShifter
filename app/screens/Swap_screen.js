import React, {Component} from 'react';
import { ActivityIndicator,AsyncStorage,View, FlatList, StyleSheet, Text} from 'react-native';
import SwapSingle from '../component/Swap_shift/SwapSingle';
import shiftManager_server from '../networking/shiftManager_server';

export default class Switching_shifts extends Component {
    constructor(inside){
        super(inside);
        this.state = {
            massegesData : {
                "data":[],
                "msg":"",
                "ok":true
            },
            listMasseges : [], 
            thereIsDataFromServer : false,
            frontText: "",
            thereIsShiftsSwap: false,
            MessageDisplay: "",
        }                              
    }

    componentDidMount = async () => {
        this.setState({thereIsDataFromServer:false});
        let toSend = {"statuses" : ["wait_for_swap","wait_for_confirm"]}

        let token = await AsyncStorage.getItem('token');
        const response = await shiftManager_server.post('/GetShiftsSwaps',toSend, { ///get('/api/v1/shifts_swaps', {params:{"statuses" : ["wait_for_confirm"]},     //post('/GetShiftsSwaps',toSend, { //get('/api/v1/shifts_swaps', toSend,{
          headers: {
              Authorization: "Bearer " + token
          }
        }).then(response => {

        if (response.data.data.length == 0) // there is no swaps
        {
            this.setState({thereIsShiftsSwap:false});
            this.setState({MessageDisplay:response.data.msg});
        }
        else{
            this.setState({thereIsShiftsSwap:true});
        }
        return  response.data;
        }).catch(err => {
        Alert.alert("something get wrong, please try again");
        this.props.navigation.goBack(null);
        });

        this.setState({massegesData:response});
        if(this.state.massegesData.ok != true)
        {
            Alert.alert("There was a problem receiving the messages, please try again");
            this.props.navigation.goBack(null);
        }
        
        let updatList=[];
        let statusFormat="";
        let numberOfMasseges = this.state.massegesData.data.length;

        for (let i =0; i<numberOfMasseges; i++)
        {   
            if(this.state.massegesData.data[i].status=='wait_for_swap')
            {
                statusFormat = 'wait for swap';
            }
            else if (this.state.massegesData.data[i].status=='wait_for_confirm')
            {
                statusFormat = 'wait for confirm';
            }
            else if(this.state.massegesData.data[i].status=='confirmed')
            {
                statusFormat= 'confirmed'
            }

            let temp = {date: this.state.massegesData.data[i].shift_details.date,
                        start_time:this.state.massegesData.data[i].shift_details['start_time'],
                        end_time:this.state.massegesData.data[i].shift_details['end_time'],
                        Who_asks:this.state.massegesData.data[i].name_employee_ask,
                        status:statusFormat,
                        id:this.state.massegesData.data[i].id,
                        id_employee_ask:this.state.massegesData.data[i].id_employee_ask
                        };
            updatList.push(temp);
        }

        this.setState({listMasseges:updatList});
        this.setState({thereIsDataFromServer:true});
    }

        render() { 
            
            if(this.state.thereIsDataFromServer == false)
            {
                return (<View style={Styles.center}><ActivityIndicator  size="large" color="#0000ff" /></View>);
            }
            return(
            <View  style={Styles.content}>
               { this.state.thereIsShiftsSwap ? (
                    <View style={Styles.messageFrame} >
                            <FlatList
                                data={this.state.listMasseges}
                                keyExtractor={(item, index) => {return item.id.toString();}}
                                renderItem={({item})=>(<SwapSingle item={item} render_screen = {this.componentDidMount}/>)}
                            />
                    </View>
               ):(
                <View style={Styles.messageDisplay} ><Text style={Styles.msgtext} >{this.state.MessageDisplay}</Text></View>
               )}
            </View>
            );
        }
        
}

const Styles = StyleSheet.create({
    messageFrame: {
        paddingTop:10,
        flex: 1,
        backgroundColor: "#36485f",
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    content: {
        padding:16,
        backgroundColor:'#36485f',
        flex:1,
    },
    msgtext: {
        color: "#f5fffa",
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
      },
    messageDisplay:{
        alignSelf: 'center',
        paddingTop: 160,           
    },
})

