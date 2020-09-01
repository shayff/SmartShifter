import React, {useState, Component} from 'react';
import { AsyncStorage,StyleSheet, Text, View, ActivityIndicator,Alert,FlatList} from 'react-native';
import SingleMessage from '../component/messages/SingleMessage'
import member_server from '../networking/member_server';

export default class Messages extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            thereIsDataFromServer : false,
            massegesData : {
                "data":[],
                "msg":'',
                "ok":false
            },
            listMasseges : [],
            thereIsMSG: false,
            MSGtoEMP: "",
        }
                                    
      }

      // function that call after the constractor 
      componentDidMount = async () => {
   

        let token = await AsyncStorage.getItem('token');
        const response = await member_server.get('/getmessage', {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        console.log("GOOD " + response.data.data);
        if (response.data.data.length == 0) // there is no messages
        {
            this.setState({thereIsMSG:false});
            this.setState({MSGtoEMP:response.data.msg});
        }
        else{
            this.setState({thereIsMSG:true});
        }

        return  response.data;
      }).catch(err => {
        console.log("EROR "+err.response.data);

      });
      console.log(response);

      this.setState({massegesData:response});
      
      if(this.state.massegesData.ok != true)
      {
          Alert.alert("There was a problem receiving the messages, please try again");
          this.props.navigation.goBack(null);
      }
        
        let updatList=[];
        console.log(this.state.massegesData.data.length);
        let numberOfMasseges = this.state.massegesData.data.length;
        
        for (let i =0; i<numberOfMasseges; i++)
        {
            let temp = {name_sender: this.state.massegesData.data[i].name_sender,
                        massege:this.state.massegesData.data[i].message,
                        title: this.state.massegesData.data[i].title,
                        time_created: this.state.massegesData.data[i].time_created,
                        id: this.state.massegesData.data[i]._id};
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
            
            <View style={Styles.content}>
                {this.state.thereIsMSG ? (
                <View>
                    <FlatList
                        data={this.state.listMasseges}
                        keyExtractor={(item, index) => {return item.time_created;}}
                        renderItem={({item})=>(<SingleMessage item={item}/>)}
                    />
                </View>
                ) : (
                    <View style={Styles.global} ><Text style={Styles.msgtext} >{this.state.MSGtoEMP}</Text></View> // need styles
                )} 

            </View>

        
        );
    }
    }

    
    const Styles = StyleSheet.create({

        Text: {
            alignSelf:'center',
            color: '#ffff',
            fontWeight: 'bold',
        },
        content: {
            padding:16,
            backgroundColor:'#36485f',
            flex:1,
        },
        saveElement: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        touchArea: {
            width: 200,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1d9aad',
        },
        msgtext: {
            color: "#f5fffa",
            fontSize: 20,
            fontWeight: "bold",
            alignItems: 'center',
          },
        global:{
            alignSelf: 'center',
            paddingTop: 160,           
        },
        

        
        })

