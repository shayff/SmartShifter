import React, {Component} from 'react';
import { AsyncStorage,StyleSheet, Text, View } from 'react-native';
import SubjectButton from '../component/crossScreen/sbjectSquare';


export default class Cross_screen extends Component {
    constructor(inside){
      super(inside);
      this.state = {
          Name:'',
          isHaveCompany: false,
          can_employee_switch: false,

      }
    }

  componentDidMount = async () =>
  {
    let firstName = await AsyncStorage.getItem('name');
    let name = "Welcome "+ firstName;
    let company = await AsyncStorage.getItem('company');
    let isTrueSet = ('true' == await AsyncStorage.getItem('can_employee_switch_shifts'));
    this.setState({can_employee_switch:isTrueSet});
    
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

          <View style={Styles.separation}>
                  <View style={Styles.line}>
                      <View>
                          <SubjectButton fatherProps={this.props} Icon="person-outline" titelName= { 'Profile'} isLogOut={false} nevTo = {'Private_profile'}/>   
                      </View>
                  </View>

                  <View  style={Styles.line}>
                    {this.state.isHaveCompany ?(
                              <View>
                              <SubjectButton fatherProps={this.props} Icon="event-available" titelName= {' Shift arrangement'} isLogOut={false} nevTo = {'Weekly_shift_arrangement'}/>
                            </View>
                    ):(null)}

                  </View>

                  <View  style={Styles.line}>
                  {this.state.isHaveCompany ?(
                    <View>
                    <SubjectButton fatherProps={this.props} Icon="message" titelName= {' Messages'} isLogOut={false} nevTo = {'Messages'}/>
                    </View>
                    ):(null)}

                  </View>
            

                  <View  style={Styles.line}>
                  {this.state.isHaveCompany ?(
                    <View>
                    <SubjectButton fatherProps={this.props} Icon="today"  titelName= {' User preferences'}  isLogOut={false} nevTo = {'User_preferences'} />
                    </View>
                    ):(null)}
                  </View>



                  <View  style={Styles.line}>
                  {this.state.isHaveCompany ?(this.state.can_employee_switch ?
                    <View>
                    <SubjectButton fatherProps={this.props} Icon="swap-horiz" titelName= {' Switching shifts'}  isLogOut={false} nevTo = {'Switching_shifts'}/>
                    </View>
                    :null):null}

                  </View>

                <View>
                      <View style={Styles.LogOut}>
                          <SubjectButton fatherProps={this.props} Icon="exit-to-app" titelName= { ' Log Out'} isLogOut={true}  nevTo = {'Enter_Screen'}/>   
                      </View>
                </View>
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
    paddingTop: 3,
    backgroundColor:'#36485f',
  },
  separation:{
    paddingTop:25,
  },
  text: {
    color: "#f5fffa",
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: 30,
  },
  LogOut:
  {
    paddingTop: 30,
  },
});
