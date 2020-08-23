import React, {useState, Component} from 'react';
import { AsyncStorage,StyleSheet, Button,Text, TextInput , View, Image, Keyboard, TouchableOpacity,ScrollView, Alert } from 'react-native';
import member_server from '../networking/member_server';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Private_profile extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            profileDataUser:{"id number": "loding...",
            "phone": "loding...",
            "first name": "loding...",
            "last name": "loding...",
            "date of birth": "loding...",
            "address": "loding...",
            "gender": "loding...",
            "company": 'loding...',
            "email": "loding...",
            "password": "",
            "password to confirm":"******"},

            titleBTpasseord : "Confirm first",
            isWriteToConfirmPassword : true,
            titleOldPassword : "Enter password",
            saveText:'not been a change',
            currectAnswer: true,
            

      }
    }

    componentDidMount = async () => {
        //let data = this.Get_masseges_server_data();
        //this.setState({massegesData:data});

        let token = await AsyncStorage.getItem('token');
        const response = await member_server.get('/profile', {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        console.log("EROR "+err.response.data);

      });

      let resData = response.data;
      let password = await AsyncStorage.getItem('password');

      let details = {
        "id number": resData["id number"],
        "phone": resData["phone"],
        "first name": resData["first name"],
        "last name": resData["last name"],
        "date of birth": resData["date of birth"],
        "gender": resData['gender'],
        "address": resData["address"],
        "company": resData["company name"],
        "email": resData["email"],
        "password": "",
        "password to confirm": "*****"};

        this.setState({profileDataUser:details});

      }
    
    
      confirm_password = async (data) =>
      {

        if(this.state.isWriteToConfirmPassword)
        {
            this.refs.oldPassword.setNativeProps({ editable : true });
            this.setState({titleOldPassword:"prees to confirm"});
            this.setState({isWriteToConfirmPassword:false});
            this.refs.oldPassword.focus();
        }
        else // he press to check password
        {
            let hisPassword = await AsyncStorage.getItem('password');

            if(hisPassword == this.state.profileDataUser["password to confirm"])
            {
                console
                this.setState({titleBTpasseord:"Edit"});
                this.setState({currectAnswer:false});
                
            }
            else
            {
                Alert.alert("worng password");
                this.refs.oldPassword.focus();

            }

        }

      }


      
      save_user_change = async () =>
      {
        let ps="null";
        console.log(this.state.profileDataUser["password"]);
        if(this.state.profileDataUser["password"] != "") // so he is update password
        {
            ps = this.state.profileDataUser["password"];
            await AsyncStorage.setItem("password",this.state.profileDataUser["password"]);
        console.log("lo");

        }
        else
        {

            ps = await AsyncStorage.getItem('password');

        }

        await AsyncStorage.setItem("name",this.state.profileDataUser["first name"]);


          let newDataToSend = {
              "email":this.state.profileDataUser["email"],
              "password":ps,
              "id number":this.state.profileDataUser["id number"],
              "phone":this.state.profileDataUser["phone"],
              "first name":this.state.profileDataUser["first name"],
              "last name":this.state.profileDataUser["last name"],
              "address":this.state.profileDataUser["address"],
              "gender":this.state.profileDataUser["gender"],
              "date of birth":this.state.profileDataUser["date of birth"]
            }

            


        let token = await AsyncStorage.getItem('token');
        const response = await member_server.post('/updateprofile',
        newDataToSend,
            {
            headers: {
                Authorization: "Bearer " + token 
            }
      }).then(response => {
        console.log("update " + response.data.data);
        return  response.data;
      }).catch(err => {
        console.log("EROR "+err.response.data);

      });
      this.props.navigation.goBack(null);


      }

    render() {  
        return(
            
            <View style={Styles.all}>
            <ScrollView style={Styles.container}>
                <View style={Styles.line}>
                        <Text style={Styles.titel}>ID: </Text>
                        <TextInput style={Styles.TextInput} ref='idNumber' onChangeText={(data) => {this.state.profileDataUser["id number"]=data}}  editable =  {false}>{this.state.profileDataUser["id number"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.idNumber.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.idNumber.focus();}}>  
                        </Icon.Button>    
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>First Name: </Text>
                        <TextInput style={Styles.TextInput} ref='firstName' onChangeText={(data) => {this.state.profileDataUser["first name"]=data}} editable =  {false}>{this.state.profileDataUser["first name"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.firstName.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.firstName.focus();}}>  
                        </Icon.Button>  
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>Lest Name: </Text>
                        <TextInput style={Styles.TextInput} ref='lestName' onChangeText={(data) => {this.state.profileDataUser["last name"]=data}} editable =  {false}>{this.state.profileDataUser["last name"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.lestName.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.lestName.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>Date of birth: </Text>
                        <TextInput style={Styles.TextInput} ref='dateOfBirth' onChangeText={(data) => {this.state.profileDataUser["date of birth"]=data}} editable =  {false}>{this.state.profileDataUser["date of birth"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.dateOfBirth.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.dateOfBirth.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>address: </Text>
                        <TextInput style={Styles.TextInput} ref='address' onChangeText={(data) => {this.state.profileDataUser["address"]=data}} editable =  {false}>{this.state.profileDataUser["address"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.address.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.address.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>gender: </Text>
                        <TextInput style={Styles.TextInput} ref='gender' onChangeText={(data) => {this.state.profileDataUser["gender"]=data}} editable =  {false}>{this.state.profileDataUser["gender"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.gender.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.gender.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>Phone: </Text>
                        <TextInput style={Styles.TextInput} ref='phone' onChangeText={(data) => {this.state.profileDataUser["phone"]=data}} editable =  {false}>{this.state.profileDataUser["phone"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.phone.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.phone.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>Email: </Text>
                        <TextInput style={Styles.TextInput} ref='email' onChangeText={(data) => {this.state.profileDataUser["email"]=data}} editable =  {false}>{this.state.profileDataUser["email"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.email.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.email.focus();}}>  
                        </Icon.Button>                      
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.titel}>Company: </Text>
                        <TextInput style={Styles.TextInput} ref='company' onChangeText={(data) => {this.state.profileDataUser["company"]=data}} editable =  {false}>{this.state.profileDataUser["company"]}</TextInput>
                        <Icon.Button
                            //     name="edit"
                                backgroundColor="#36485f"
                                disabled
                                onPress={(data)=>{this.refs.company.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.company.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.passwordLine}>
                    <Text style={Styles.titel}>Confirm password: </Text>
                    <TextInput style={Styles.TextInput} secureTextEntry ref='oldPassword' onChangeText={(data) => {this.state.profileDataUser["password to confirm"]=data}} editable =  {false}>{this.state.profileDataUser["password to confirm"]}</TextInput>
                    <Button title={this.state.titleOldPassword} onPress={this.confirm_password}></Button>
                </View>
                        
                <View style={Styles.line}>
                    <Text style={Styles.titel}>New password: </Text>
                    <TextInput style={Styles.TextInput} ref='password' onChangeText={(data) => {this.state.profileDataUser["password"]=data}} editable =  {false}>{this.state.profileDataUser["password"]}</TextInput>
                    <Button disabled ={this.state.currectAnswer} ref="BTpasseord" title={this.state.titleBTpasseord} onPress={(data)=>{this.refs.password.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.password.focus();}}></Button>
                </View>

                    <TouchableOpacity style={Styles.sendArea} onPress = {() => this.save_user_change()}>
                        <Text ref='saveText' style={Styles.sendText}>{this.state.saveText}</Text>
                    </TouchableOpacity>
            </ScrollView>
            </View>
        );
    }
}


    
const Styles = StyleSheet.create({
    sendArea:
    {
        backgroundColor: '#2980b9',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 1,
        padding: 6, 
        height:45
    },
    TextInput:
    {
        color: '#ffff',
        fontSize: 16,
        opacity:0.7,

    },
    container:
    {
        flex:1,
        backgroundColor:'#36485f', 
        borderWidth: 3,
        borderRadius: 10,
        marginVertical: 10,
        padding: 4, 

    },
    line:
    {
        paddingBottom: 5,
        flexDirection : 'row',
        alignItems: 'center',
        paddingLeft: 20,
        justifyContent:"space-between",
     
    },
    passwordLine:
    {
        paddingBottom: 20,
        flexDirection : 'row',
        alignItems: 'stretch',
        paddingLeft: 20,
        justifyContent:"space-between",
        borderBottomWidth: 1,
        borderBottomColor: '#36485f',
        paddingTop:7,
    },
    secendSubject: {
        paddingLeft:30,
        backgroundColor: '#ffff',    
      },
      titel: {
        fontWeight: 'bold',
        fontSize:16,
        color:'#ffff',
      },
      sendText: {
          fontWeight: 'bold',
          color: '#ffff',    
          paddingLeft:120,
          fontSize:20,
         
      },
      all:{
      backgroundColor: '#2980b9',
       width:410,
       height:600,
       
      },
});



