import React, {useState, Component} from 'react';
import { AsyncStorage,SafeAreaView, View, FlatList, StyleSheet, Text,ScrollView } from 'react-native';
import SwapSingle from '../component/Swap_shift/SwapSingle';
import shiftManager_server from '../networking/shiftManager_server';

export default class Switching_shifts extends Component {


    constructor(inside){
        super(inside);
        this.state = {
            massegesData : {
                "data":[],
                "ok":true
            },
            listMasseges : [], 
            // frontText: "loding..." 
        }                              
    }

    componentDidMount = async () => {
        let toSend = {"statuses" : ["confirmed","wait_for_swap","wait_for_confirm"]}

        let token = await AsyncStorage.getItem('token');
        const response = await shiftManager_server.post('/GetShiftsSwaps',toSend, {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        console.log("EROR "+err.response.data);

      });

      this.setState({massegesData:response});


        if(this.state.massegesData.ok != true)
        {
            Alert.alert("There was a problem receiving the messages, please try again");
            this.props.navigation.goBack(null);
        }
        
        let updatList=[];

        let numberOfMasseges = this.state.massegesData.data.length;
        
        for (let i =0; i<numberOfMasseges; i++)
        {
            let temp = {date: this.state.massegesData.data[i].shift_details.date,
                        start_time:this.state.massegesData.data[i].shift_details['start time'],
                        end_time:this.state.massegesData.data[i].shift_details['end time'],
                        Who_asks:this.state.massegesData.data[i].name_employee_ask,
                        status:this.state.massegesData.data[i].status,
                        id:this.state.massegesData.data[i].id
                        };
            updatList.push(temp);
        }

        this.setState({listMasseges:updatList});
    }


        save_and_exit = () =>
        {
        this.props.navigation.goBack(null);
        }


        render() {  
            return(
                    <SafeAreaView style={Styles.container} >
                            <FlatList
                                data={this.state.listMasseges}
                                keyExtractor={(item, index) => {return item.id.toString();}}
                                renderItem={({item})=>(<SwapSingle item={item}/>)}
                            />
                    </SafeAreaView>
            );
        }
}
    
const Styles = StyleSheet.create({

    container: {
        paddingTop:10,
        flex: 1,
        backgroundColor: "#36485f",
        alignItems: 'center'
    },
    text: {
        fontSize: 40,
        paddingTop: 50,
        paddingBottom:30,
        color:"#638cb0",
    },
    content: {
        padding:16,
        backgroundColor:'#36485f',
        flex:1,
    },
    touchArea: {
        width: 300,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1d9aad',
    },
})

