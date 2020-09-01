import React, {useState, Component} from 'react';
import { CheckBox,AsyncStorage,StyleSheet, Text, View } from 'react-native';
import member_server from '../../networking/member_server';


export default class SingleMessage extends Component {
    
    constructor(inside){
        super(inside);
        this.state = {
            isRead : false,
            textIsRead : "",
        }                      
      }


      componentDidMount =  () => {
    
        if (this.props.item.is_read == "read" )
        {
         this.setState({isRead:true});
         this.setState({textIsRead:"You already confirm reading:" });

        }
        else
        {
         this.setState({isRead:false});
         this.setState({textIsRead:"Check to confirm reading:" });

        }
    }

    click_to_verify = async () => {

        let token = await AsyncStorage.getItem('token');

        let toSend = {
            "id" : this.props.item.id,
            "status": "read"
        }
        const response = await member_server.post('/updatemessage',
    toSend,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(response => {

        this.setState({isRead:true});
        this.setState({textIsRead:"You already confirm reading:" });
        return  response.data;
        }).catch(err => {
        Alert.alert("something get wrong, please try again");
        });
    }

      render() { 
return (

    <View style={Styles.itemSet}>
        <View style={Styles.titleLine}>
            <Text style={Styles.title}>Title: </Text>
            <Text style={Styles.secendTitle}>{this.props.item.title}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Date: </Text>
            <Text style={Styles.secendTitle}>{this.props.item.time_created}</Text>
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Sender Name: </Text>
            <Text style={Styles.secendTitle}>{this.props.item.name_sender}</Text>
 
        </View>

        <View style={Styles.line}>
            <Text style={Styles.title}>Content: </Text>
            <Text style={Styles.secendTitle}>{this.props.item.massege}</Text>
        </View>

         <View style={Styles.verifyLine}>
            <Text  style={this.state.isRead ? Styles.verifyTitle_read : Styles.verifyTitle_unRead}>{this.state.textIsRead}</Text>
            <CheckBox disabled={this.state.isRead} value = {this.state.isRead} onValueChange = {this.click_to_verify} />
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
    verifyTitle_read:{
        
        color: '#ff0000',
        fontSize:14,
        fontWeight: 'bold',
        paddingTop:4,
    },
    verifyTitle_unRead:{
        color: '#2e8b57',
        fontSize:14,
        fontWeight: 'bold',
        paddingTop:4,
    },
    verifyLine:{
        
        flexDirection : 'row',
        alignItems: 'stretch',
        paddingTop:10,
    }


})