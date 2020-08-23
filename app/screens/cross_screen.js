import React, {useState, Component} from 'react';
import { AsyncStorage,StyleSheet, Text, View } from 'react-native';
import SubjectButton from '../component/crossScreen/sbjectSquare';


export default class Cross_screen extends Component {
    constructor(inside){
      super(inside);
      this.state = {
          Name:'',
          isHaveCompany: false,

      }
    }

  componentDidMount(){
    this.get();
  }

  get = async (data_send) =>
  {
    let firstName = await AsyncStorage.getItem('name');
    let name = "Welcome "+ firstName;
    let company = await AsyncStorage.getItem('company');
    
    if(company != "null")
      {
        this.setState({isHaveCompany:true});
      }
      else
      {
        this.setState({isHaveCompany:false});
      }
    
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
                  {this.state.isHaveCompany ?(
                            <View>
                            <SubjectButton fatherProps={this.props} Icon="event-available" titelName= {' Shift arrangement'}  nevTo = {'Weekly_shift_arrangement'}/>
                          </View>
                  ):(null)}

                </View>
          
                <View  style={Styles.line}>
                {this.state.isHaveCompany ?(
                  <View>
                  <SubjectButton fatherProps={this.props} Icon="swap-horiz" titelName= {' Switching shifts'}  nevTo = {'Switching_shifts'}/>
                  </View>
                  ):(null)}

                </View>

                <View  style={Styles.line}>
                {this.state.isHaveCompany ?(
                  <View>
                  <SubjectButton fatherProps={this.props} Icon="message" titelName= {' Messages'}  nevTo = {'Messages'}/>
                  </View>
                  ):(null)}

                </View>
          

                <View  style={Styles.line}>
                {this.state.isHaveCompany ?(
                  <View>
                  <SubjectButton fatherProps={this.props} Icon="today"  titelName= {' User preferences'}  nevTo = {'User_preferences'} />
                  </View>
                  ):(null)}
               </View>

        </View>
      );
  }


}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36485f",
    alignItems: 'center'
  },
  line:
  {
    flexDirection : 'row',
    alignItems: 'stretch',
    paddingTop: 5,
    backgroundColor:'#36485f',
  },
  firstLine:{
    
    flexDirection : 'row',
    alignItems: 'stretch',
    paddingTop: 40,
    backgroundColor:'#36485f',
  },
  text: {
    color: "#f5fffa",
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: 30,

  }

});
