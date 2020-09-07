import React, {Component} from 'react';
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
            MessageDisplay: "",
        }                           
    }

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
        console.log(this.state.massegesData.data.length);
        let numberOfMasseges = this.state.massegesData.data.length;
        
        for (let i =0; i<numberOfMasseges; i++)
        {
            let temp = {name_sender: this.state.massegesData.data[i].sender_name,
                        massege:this.state.massegesData.data[i].message,
                        title: this.state.massegesData.data[i].title,
                        time_created: this.state.massegesData.data[i].time_created,
                        id: this.state.massegesData.data[i]._id,
                        is_read: this.state.massegesData.data[i].status};
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
                </View>) :
                (
                    <View style={Styles.messageDisplay} ><Text style={Styles.msgtext} >{this.state.MessageDisplay}</Text></View> // need styles
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
});

