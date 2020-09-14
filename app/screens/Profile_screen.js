import React, {Component} from 'react';
import { AsyncStorage,StyleSheet, Button,Text, TextInput , View, Image, ActivityIndicator, TouchableOpacity,ScrollView, Alert } from 'react-native';
import member_server from '../networking/member_server';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Private_profile extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            profileDataUser:{"id number": "",
            "phone": "",
            "first name": "",
            "last name": "",
            "date of birth": "",
            "address": "",
            "gender": "",
            "company": "",
            "email": "",
            "password": "",
            "password to confirm":""},

            titleBTpasseord : "Confirm first",
            isWriteToConfirmPassword : true,
            titleOldPassword : "Enter password",
            saveText:'not been a change',
            currectAnswer: true,
            thereIsDataFromServer : false
      }
    }
 
    componentDidMount = async () =>
    {
        //Communication with the server for display details
        let token = await AsyncStorage.getItem('token');
        const response = await member_server.get('/api/v1/user/profile', {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        Alert.alert("something went wrong, please try again");
        this.props.navigation.goBack(null);
      });

      let resData = response.data;
      let password = await AsyncStorage.getItem('password');

      let details = {
        "id number": resData["id_number"],
        "phone": resData["phone"],
        "first name": resData["first_name"],
        "last name": resData["last_name"],
        "date of birth": resData["date_of_birth"],
        "gender": resData['gender'],
        "address": resData["address"],
        "company": resData["company_name"],
        "email": resData["email"],
        "password": "",
        "password to confirm": "*****"};

        this.setState({profileDataUser:details});
        this.setState({thereIsDataFromServer:true});
    }
    
    //Functionality for checking whether the user has entered the current password
    confirm_password = async (data) =>
    {
        if(this.state.isWriteToConfirmPassword)
        {
            this.refs.oldPassword.setNativeProps({ editable : true });
            this.setState({titleOldPassword:"prees to confirm"});
            this.setState({isWriteToConfirmPassword:false});
            this.refs.oldPassword.focus();
        }
        else //press to check password
        {
            let hisPassword = await AsyncStorage.getItem('password');

            if(hisPassword == this.state.profileDataUser["password to confirm"])
            {
                this.setState({titleBTpasseord:"Edit"});
                this.setState({currectAnswer:false});
            }
            else
            {
                Alert.alert("wrong password");
                this.refs.oldPassword.focus();
            }
        }
    }
      
    //Functionality for updating user information
    save_user_change = async () =>
    {
        let let_password="null";
        if(this.state.profileDataUser["password"] != "") //update password
        {
            let_password = this.state.profileDataUser["password"];
            await AsyncStorage.setItem("password",this.state.profileDataUser["password"]);
        }
        else
        {
            let_password = await AsyncStorage.getItem('password');
        }

        await AsyncStorage.setItem("name",this.state.profileDataUser["first name"]);

          let newDataToSend = {
              "email":this.state.profileDataUser["email"],
              "password":let_password,
              "id_number":this.state.profileDataUser["id number"],
              "phone":this.state.profileDataUser["phone"],
              "first_name":this.state.profileDataUser["first name"],
              "last_name":this.state.profileDataUser["last name"],
              "address":this.state.profileDataUser["address"],
              "gender":this.state.profileDataUser["gender"],
              "date_of_birth":this.state.profileDataUser["date of birth"]
            }

            let token = await AsyncStorage.getItem('token');
            const response = await member_server.put('/api/v1/user',
            newDataToSend,
            {
                headers: {
                    Authorization: "Bearer " + token 
                }
            }).then(response => {
                    return  response.data;
                }).catch(err => {    
                Alert.alert("something went wrong, please try again");
                this.props.navigation.goBack(null); 
                });

      this.props.navigation.goBack(null);
    }


    render() {  
        if(this.state.thereIsDataFromServer == false)
        {
            return (<View style={Styles.center}><ActivityIndicator  size="large" color="#0000ff" /></View>);
        }
        return(
            
            <View style={Styles.frame}>
            <ScrollView style={Styles.container}>
                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>ID: </Text>
                        <TextInput style={Styles.TextInput} ref='idNumber' onChangeText={(data) => {this.state.profileDataUser["id number"]=data}}  editable =  {false}>{this.state.profileDataUser["id number"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.idNumber.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.idNumber.focus();}}>  
                        </Icon.Button>    
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>First Name: </Text>
                        <TextInput style={Styles.TextInput} ref='firstName' onChangeText={(data) => {this.state.profileDataUser["first name"]=data}} editable =  {false}>{this.state.profileDataUser["first name"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.firstName.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.firstName.focus();}}>  
                        </Icon.Button>  
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Last Name: </Text>
                        <TextInput style={Styles.TextInput} ref='lestName' onChangeText={(data) => {this.state.profileDataUser["last name"]=data}} editable =  {false}>{this.state.profileDataUser["last name"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.lestName.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.lestName.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Date of birth: </Text>
                        <TextInput style={Styles.TextInput} ref='dateOfBirth' onChangeText={(data) => {this.state.profileDataUser["date of birth"]=data}} editable =  {false}>{this.state.profileDataUser["date of birth"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.dateOfBirth.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.dateOfBirth.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Address: </Text>
                        <TextInput style={Styles.TextInput} ref='address' onChangeText={(data) => {this.state.profileDataUser["address"]=data}} editable =  {false}>{this.state.profileDataUser["address"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.address.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.address.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Gender: </Text>
                        <TextInput style={Styles.TextInput} ref='gender' onChangeText={(data) => {this.state.profileDataUser["gender"]=data}} editable =  {false}>{this.state.profileDataUser["gender"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.gender.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.gender.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Phone: </Text>
                        <TextInput style={Styles.TextInput} ref='phone' onChangeText={(data) => {this.state.profileDataUser["phone"]=data}} editable =  {false}>{this.state.profileDataUser["phone"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.phone.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.phone.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Email: </Text>
                        <TextInput style={Styles.TextInput} ref='email' onChangeText={(data) => {this.state.profileDataUser["email"]=data}} editable =  {false}>{this.state.profileDataUser["email"]}</TextInput>
                        <Icon.Button
                                name="edit"
                                backgroundColor="#a9a9a9"
                                onPress={(data)=>{this.refs.email.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.email.focus();}}>  
                        </Icon.Button>                      
                </View>

                <View style={Styles.line}>
                        <Text style={Styles.lineTitle}>Company: </Text>
                        <TextInput style={Styles.TextInput} ref='company' onChangeText={(data) => {this.state.profileDataUser["company"]=data}} editable =  {false}>{this.state.profileDataUser["company"]}</TextInput>
                        <Icon.Button
                                backgroundColor="#36485f"
                                disabled
                                onPress={(data)=>{this.refs.company.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.company.focus();}}>  
                        </Icon.Button> 
                </View>

                <View style={Styles.passwordLine}>
                    <Text style={Styles.lineTitle}>Confirm password: </Text>
                    <TextInput style={Styles.TextInput} secureTextEntry ref='oldPassword' onChangeText={(data) => {this.state.profileDataUser["password to confirm"]=data}} editable =  {false}>{this.state.profileDataUser["password to confirm"]}</TextInput>
                    <Button title={this.state.titleOldPassword} onPress={this.confirm_password}></Button>
                </View>
                        
                <View style={Styles.line}>
                    <Text style={Styles.lineTitle}>New password: </Text>
                    <TextInput style={Styles.TextInput} ref='password' onChangeText={(data) => {this.state.profileDataUser["password"]=data}} editable =  {false}>{this.state.profileDataUser["password"]}</TextInput>
                    <Button disabled ={this.state.currectAnswer} ref="BTpasseord" title={this.state.titleBTpasseord} onPress={(data)=>{this.refs.password.setNativeProps({ editable : true });this.setState({saveText: 'Save change and Exit'}); this.refs.password.focus();}}></Button>
                </View>

                    <TouchableOpacity style={Styles.sendButton} onPress = {() => this.save_user_change()}>
                        <Text ref='saveText' style={Styles.sendText}>{this.state.saveText}</Text>
                    </TouchableOpacity>
            </ScrollView>
            </View>
        );
    }
}


    
const Styles = StyleSheet.create({
    sendButton:
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
    lineTitle: {
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
    frame:{
      backgroundColor: '#2980b9',
       width:412,
       height:610,
    },
});



