import React, {useState, Component} from 'react';
import { AsyncStorage,StyleSheet, Text, View } from 'react-native';
import SubjectButton from '../component/crossScreen/sbjectSquare';


export default class Cross_screen extends Component {
    constructor(inside){
      super(inside);
      this.state = {
          Name:'',

      }
    }

  componentDidMount(){
    this.get();
  }

  get = async (data_send) =>
  {
    let firstName = await AsyncStorage.getItem('name');
    let name = "welcome "+ firstName;
    this.setState({Name:name});
  }

  render() {  
        return(
        <View style={Styles.container}>

          <View >
            <Text style={Styles.text} >{this.state.Name}</Text>
          </View>

          <View style={Styles.firstLine}>
               <View>
                   <SubjectButton fatherProps={this.props} Icon="person-outline" titelName= { 'Profile'}  nevTo = {'Private_profile'}/>   
               </View>
          </View>

                <View  style={Styles.line}>
                  <View>
                    <SubjectButton fatherProps={this.props} Icon="event-available" titelName= {' Shift arrangement'}  nevTo = {'Weekly_shift_arrangement'}/>
                  </View>
                </View>
          
                <View  style={Styles.line}>
                  <View>
                    <SubjectButton fatherProps={this.props} Icon="swap-horiz" titelName= {' Switching shifts'}  nevTo = {'Switching_shifts'}/>
                    </View>
                </View>

                <View  style={Styles.line}>
                  <View>
                   <SubjectButton fatherProps={this.props} Icon="message" titelName= {' Messages'}  nevTo = {'Messages'}/>
                   </View>
                </View>
          

                <View  style={Styles.line}>
                  <View>
                <SubjectButton fatherProps={this.props} Icon="today"  titelName= {' User preferences'}  nevTo = {'User_preferences'} />
                </View>
               </View>

        </View>
      );
  }


}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36485f",// צבע רקע של כל האפליקציה
    alignItems: 'center'
  },
  line:
  {
    flexDirection : 'row',
    alignItems: 'stretch',
    paddingTop: 5,
    backgroundColor:'#36485f',// צבע רגע של השורה
  },
  firstLine:{
    
    flexDirection : 'row',
    alignItems: 'stretch',
    paddingTop: 50,
    backgroundColor:'#36485f',// צבע רגע של השורה
  },
  text: {
    fontSize: 40,
    paddingTop: 30,
    color:"#638cb0",
  }

});
