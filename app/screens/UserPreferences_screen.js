import React, {Component} from 'react';
import { ActivityIndicator ,AsyncStorage,StyleSheet, Text, View,TouchableOpacity, Alert,Button, ScrollView } from 'react-native';
import DaySquare from '../component/userPreferences/daySquare';
import company_server from '../networking/company_server';

/*
The screen displays parts of the day, the user selects his preference for its availability on weekdays.

By days, parts of the day: morning 0, noon 1, evening 2.
Types of preferences: not available, available, preferred.
You can press the prefer button once a day, it gives the user a better chance of appearing on this shift.
*/
export default class User_preferences extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            textDayName:'null',
            shiftOfTheWeek:[{date: '', prefer: [], available: []},{date: '', prefer: [], available: []},{date: '', prefer: [], available: []},{date: '', prefer: [], available: []},{date: '', prefer: [], available: []},{date: '', prefer: [], available: []},{date: '', prefer: [], available: []}],
            currentSelectShift: [{dayName:'Sunday', prefereces:[0,0,0]}, {dayName:'Monday', prefereces:[0,0,0]} ,
                                     {dayName: 'Tuesday', prefereces:[0,0,0]},{dayName: 'Wednesday' ,prefereces:[0,0,0]}, {dayName: 'Thursday',prefereces:[0,0,0]},{dayName : 'Friday',prefereces: [0,0,0]},{dayName: 'Saturday',prefereces: [0,0,0]}],
            ShiftsFromManager:{},
            whichShiftToShowe: [[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]],
            whichTypePrefer: [false,false,false],
            availability: -1,
            thereIsDataFromServer: false,
            menegerSendShift : true,
            MessageDisplay: "",
            minimumShifts: "",
        }
    }

    componentDidMount = async () => {
        //Communication with the server, bring the parts on the day the manager requested
        let token = await AsyncStorage.getItem('token');
        const response = await company_server.get('/api/v1/company/preferences', {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(response => {
            // message to Minimum shifts are required
            let min_Shifts_Message = " Please submit at least " + response.data.minimum_shifts.toString()+ " shifts"; 
            this.setState({minimumShifts:min_Shifts_Message});
      
            if(response.data.msg != "Successfully")
            {
                this.setState({MessageDisplay:response.data.msg});
                this.setState({menegerSendShift:false});
            }
            else
            {   //Initializing variables The information we received from the server
                this.setState({ShiftsFromManager:response.data.data}, () => this.daysShift());
                this.setState({menegerSendShift:true});
                //A message that appears on the screen shows how many shifts the employee must submit
                Alert.alert(this.state.minimumShifts);
            }

            this.setState({thereIsDataFromServer:true});

            return  response.data;

        }).catch(err => {
            Alert.alert("something went wrong, please try again");
            this.props.navigation.goBack(null);
            });
    }
    
    daysShift = () =>
    {
        let update = this.getShiftByDay();
        this.setState({whichShiftToShowe:update});
    }
    
    getShiftByDay = () =>
    {
        let update =[[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]];
        
        update[0] = this.dayPreferencesManager(this.state.ShiftsFromManager.sunday.preference);
        update[1] = this.dayPreferencesManager(this.state.ShiftsFromManager.monday.preference);
        update[2] = this.dayPreferencesManager(this.state.ShiftsFromManager.tuesday.preference);
        update[3] = this.dayPreferencesManager(this.state.ShiftsFromManager.wednesday.preference);
        update[4] = this.dayPreferencesManager(this.state.ShiftsFromManager.thursday.preference);
        update[5] = this.dayPreferencesManager(this.state.ShiftsFromManager.friday.preference);
        update[6] = this.dayPreferencesManager(this.state.ShiftsFromManager.saturday.preference);
        
        return update;
    }
        
    dayPreferencesManager = (dayPreferences) =>
    {
      let daySelectedShift = [false,false,false];

      for (let i =0; i<dayPreferences.length; i++)
      {
          daySelectedShift[dayPreferences[i]] = true;
      }
      return daySelectedShift;
    }

    update_select_prefers = (prefer) =>
    {
        if(this.state.availability == -1)
        {
            Alert.alert("choose priority first");
        }
        else
        {
            var objectDay = new Date(prefer.dateName);
            var dayName = objectDay.getDay();
            
            // if it 'prefer' availability , check that there is no 2 'prefer' shift in the same day
            if(this.state.availability == 2)
            {
                if (this.state.currentSelectShift[dayName].prefereces[0] == 2 || this.state.currentSelectShift[dayName].prefereces[1] == 2 || this.state.currentSelectShift[dayName].prefereces[2] == 2)
                {
                    Alert.alert('You already have "prefer" shift in this day');
                }
                else
                {
                    this.state.currentSelectShift[dayName].prefereces[prefer.typeOfShift] = this.state.availability;
                }
                
            }
            else
            {
                this.state.currentSelectShift[dayName].prefereces[prefer.typeOfShift] = this.state.availability;
            }
        }
    }
 
    parse_to_data_server = () =>
    {
        for (let i =0; i < 6; i++) { // i = day of week
            for (let j =0; j < 3; j++) // j = type of shift
            {
                switch(this.state.currentSelectShift[i].prefereces[j]) { 
                    case 0:
                        break;
                    case 1:
                        this.state.shiftOfTheWeek[i].available.push(j);
                        break;
                    case 2:
                        this.state.shiftOfTheWeek[i].prefer.push(j);
                        break;
                    default:
                        Alert.alert("NUMBER NOT FOUND");
                }
            }
        }
        this.state.shiftOfTheWeek[0].date = this.state.ShiftsFromManager.sunday.date;
        this.state.shiftOfTheWeek[1].date = this.state.ShiftsFromManager.monday.date;
        this.state.shiftOfTheWeek[2].date = this.state.ShiftsFromManager.tuesday.date;
        this.state.shiftOfTheWeek[3].date = this.state.ShiftsFromManager.wednesday.date;
        this.state.shiftOfTheWeek[4].date = this.state.ShiftsFromManager.thursday.date;
        this.state.shiftOfTheWeek[5].date = this.state.ShiftsFromManager.friday.date;
        this.state.shiftOfTheWeek[6].date = this.state.ShiftsFromManager.saturday.date;
    }


    send_shift_weekly_data = async () =>
    {
        this.parse_to_data_server();
        let toSend = {
            "preference": this.state.shiftOfTheWeek
        }
        let token = await AsyncStorage.getItem('token');

        const response = await company_server.post('/api/v1/company/preference/employee',
        toSend,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(response => {
            return  response.data;
        }).catch(err => {
        Alert.alert("something went wrong, please try again");
        });

        this.props.navigation.goBack(null);
    }

    updateColors = (data)=>
    {
        let up = [false,false,false];
        up[data.typeOfButton] = true;
        this.setState({availability: data.typeOfButton});   
        this.setState({whichTypePrefer: up});   
    }

    render() {  
        if(this.state.thereIsDataFromServer == false)
        {
            return (<View style={Styles.center}><ActivityIndicator  size="large" color="#0000ff" /></View>);
        }
        return(

            <ScrollView style={Styles.container}>
                {this.state.menegerSendShift ? (
                    <View>
                    <View style={Styles.line}>
                        <View style={this.state.whichTypePrefer[0] ? Styles.selectButton : Styles.UnselectButton}>
                            <Button title="not Available" color="#b22222" onPress = {()=> this.updateColors({typeOfButton: 0}) }/>
                        </View>

                        <View style={this.state.whichTypePrefer[1] ? Styles.selectButton : Styles.UnselectButton}>
                            <Button title="Available" color = "#3cb371" onPress = {()=> this.updateColors({typeOfButton: 1}) }/>
                        </View>

                        <View style={this.state.whichTypePrefer[2] ? Styles.selectButton : Styles.UnselectButton}>
                            <Button title="Prefer" color = "#9370db" onPress = {()=> this.updateColors({typeOfButton: 2}) }/>
                        </View>
                    </View>

                    <ScrollView>
                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Sunday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.sunday.date} whichShiftToShowe = {this.state.whichShiftToShowe[0]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>   

                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Monday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.monday.date} whichShiftToShowe = {this.state.whichShiftToShowe[1]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Tuesday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.tuesday.date} whichShiftToShowe = {this.state.whichShiftToShowe[2]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <View style={Styles.line}>  
                            <DaySquare dayName={ 'Wednesday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.wednesday.date} whichShiftToShowe = {this.state.whichShiftToShowe[3]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Thursday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.thursday.date} whichShiftToShowe = {this.state.whichShiftToShowe[4]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Friday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.friday.date} whichShiftToShowe = {this.state.whichShiftToShowe[5]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <View style={Styles.line}>
                            <DaySquare dayName={ 'Saturday'} typeOfAvailabilityColor = {this.state.availability} dateName = {this.state.ShiftsFromManager.saturday.date} whichShiftToShowe = {this.state.whichShiftToShowe[6]} clickSelectPreferce = {this.update_select_prefers} />
                        </View>

                        <TouchableOpacity style={Styles.sendArea} onPress = {() => this.send_shift_weekly_data()}>
                            <Text style={Styles.sendText}>Send and Exit</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                ):(
                    <View style={Styles.messageDisplay} >
                         <Text style={Styles.text}> {this.state.MessageDisplay} </Text>
                    </View> 
                )}
                
            </ScrollView>
        );
    }
}

    
const Styles = StyleSheet.create({
    text: {
        color: "#f5fffa",
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
        },
    messageDisplay:{
        alignSelf: 'center',
        paddingTop: 160,           
    },
    center: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    UnselectButton : {
        borderColor: '#f5f5f5',
        borderWidth: 1,
        borderRadius: 2,
    },
    container:
    {
        flex:1,
        backgroundColor:'#36485f',
    },
    selectButton : {
        borderColor: '#5fe39d',
    },
    sendText: {
        alignSelf:'center',
        color: '#ffff',
        fontWeight: 'bold',
    },
    sendArea:
    {
        backgroundColor: '#1d9aad',
        paddingVertical: 10,
        borderRadius: 2,
    },
    line:
    {
        justifyContent: 'center',
        padding:4,
        flexDirection : 'row',
        alignItems: 'stretch',
    },
});


