import React, {useState, Component} from 'react';
import { ActivityIndicator,AsyncStorage,SafeAreaView, View, FlatList, StyleSheet, Text,TouchableOpacity } from 'react-native';
import SwapSingle from '../component/Swap_shift/SwapSingle';
import shiftManager_server from '../networking/shiftManager_server';

export default class Switching_shifts extends Component {

//new
    constructor(inside){
        super(inside);
        this.state = {
            massegesData : {
                "data":[],
                "ok":true
            },
            listMasseges : [], 
            thereIsDataFromServer : false,
            frontText: "loding..." 

        }                              
    }

    componentDidMount = async () => {
        this.setState({thereIsDataFromServer:false});
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
                statusFormat = 'wait for confrim';
            }
            else if(this.state.massegesData.data[i].status=='confirmed')
            {
                statusFormat= 'confirmed'
            }
            console.log(statusFormat);
           

            let temp = {date: this.state.massegesData.data[i].shift_details.date,
                        start_time:this.state.massegesData.data[i].shift_details['start time'],
                        end_time:this.state.massegesData.data[i].shift_details['end time'],
                        Who_asks:this.state.massegesData.data[i].name_employee_ask,
                        status:statusFormat,
                        id:this.state.massegesData.data[i].id
                        };
            updatList.push(temp);
        }

        this.setState({listMasseges:updatList});

        this.setState({thereIsDataFromServer:true});
        this.setState({frontText:"Exit"});

    }


        save_and_exit = () =>
        {
        this.props.navigation.goBack(null);
        }


        render() { 
            
            if(this.state.thereIsDataFromServer == false)
            {
                return (<View style={Styles.center}><ActivityIndicator  size="large" color="#0000ff" /></View>);
            }
            return(
            <View  style={Styles.content}>
                    <View  style={Styles.saveElement}>
                        <TouchableOpacity style={Styles.touchArea2} onPress={this.save_and_exit} >
                            <Text style={Styles.Text2}>{this.state.frontText}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.container} >
                            <FlatList
                                data={this.state.listMasseges}
                                keyExtractor={(item, index) => {return item.id.toString();}}
                                renderItem={({item})=>(<SwapSingle item={item}/>)}
                            />
                    </View>
            </View>
            );
        }
        
}
{/* <SafeAreaView style={Styles.container} >
<FlatList
    data={this.state.listMasseges}
    keyExtractor={(item, index) => {return item.id.toString();}}
    renderItem={({item})=>(<SwapSingle item={item}/>)}
/>
</SafeAreaView>
     */}
const Styles = StyleSheet.create({

    container: {
        paddingTop:10,
        flex: 1,
        backgroundColor: "#36485f",
        alignItems: 'center'
    },
    center: {

        justifyContent: 'center',
        alignItems: 'stretch',
    },
    text: {
        fontSize: 40,
        paddingTop: 50,
        paddingBottom:30,
        color:"#638cb0",
    },
    Text2: {
        alignSelf:'center',
        color: '#ffff',
        fontWeight: 'bold',
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
    touchArea2: {
        width: 200,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1d9aad',
    },
    saveElement: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})

