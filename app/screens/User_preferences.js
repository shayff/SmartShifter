// להגדיר ללוח שנה איזה ימים יהיו יכולים לליחצה
// לעצב הכל

import React, {useState, Component} from 'react';
import { StyleSheet, Text, View, Image, Keyboard, TouchableOpacity, Alert } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default class User_preferences extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            textDayName:'Select Day',
            shiftOfTheWeek:[{day: 'sunday', prefer: [], available: []},{day: 'monday', prefer: [], available: []},{day: 'tuesday', prefer: [], available: []},{day: 'wednesday', prefer: [], available: []},{day: 'thursday', prefer: [], available: []},{day: 'friday', prefer: [], available: []},{day: 'saturday', prefer: [], available: []}],
            currentSelectShift: [{dayName:'Sunday', prefereces:[0,0,0]}, {dayName:'Monday', prefereces:[0,0,0]} ,
                                     {dayName: 'Tuesday', prefereces:[0,0,0]},{dayName: 'Wednesday' ,prefereces:[0,0,0]}, {dayName: 'Thursday',prefereces:[0,0,0]},{dayName : 'Friday',prefereces: [0,0,0]},{dayName: 'Saturday',prefereces: [0,0,0]}],
            rangeOfDayAvailable: ['2020-06-07', '2020-06-13'],
                                    }
      }


    update_select_prefers = (prefer) =>
    {
        if(this.state.textDayName == 'Select Day')
        {
            Alert.alert('First select a day');

        }
        else{
            var objectDay = new Date(this.state.textDayName);
            var dayName = objectDay.getDay();

            if(prefer.availability == 2) // if it 'prefer' availability , check thath there is no 2 like that in the same day
            {
                if (this.state.currentSelectShift[dayName].prefereces[0] == 2 || this.state.currentSelectShift[dayName].prefereces[1] == 2 || this.state.currentSelectShift[dayName].prefereces[2] == 2)
                {
                    Alert.alert('You already have "prefer" shift in this day');

                }
                else // he is good
                {
                    this.state.currentSelectShift[dayName].prefereces[prefer.typeOfShift] = prefer.availability;
                }
                
            }
            else
            {
                this.state.currentSelectShift[dayName].prefereces[prefer.typeOfShift] = prefer.availability;
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
        

    }

    send_shift_weekly_data = () =>
    {
        this.parse_to_data_server();

        console.log(this.state.currentSelectShift);
        console.log(this.state.shiftOfTheWeek);

    }


    render() {  
        return(
            
            <View>
                    <Calendar
                        // Initially visible month. Default = Date()
                        current={'2020-06-01'}
                        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                        minDate={this.state.rangeOfDayAvailable[0]}
                        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                        maxDate={this.state.rangeOfDayAvailable[1]}
                        // Handler which gets executed on day press. Default = undefined
                        onDayPress={(day) => { this.setState({textDayName: day.dateString});}}
                        // Handler which gets executed on day long press. Default = undefined
                        onDayLongPress={(day) => {console.log('selected day', day)}}
                        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        monthFormat={'yyyy MM'}
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(month) => {console.log('month changed', month)}}
                        // Hide month navigation arrows. Default = false
                        hideArrows={true}
                        // Replace default arrows with custom ones (direction can be 'left' or 'right')
                        renderArrow={(direction) => (<Arrow/>)}
                        // Do not show days of other months in month page. Default = false
                        hideExtraDays={true}
                        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                        // day from another month that is visible in calendar page. Default = false
                        disableMonthChange={true}
                        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                        firstDay={1}
                        // Hide day names. Default = false
                        hideDayNames={false}
                        // Show week numbers to the left. Default = false
                        showWeekNumbers={false}
                        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        onPressArrowLeft={substractMonth => substractMonth()}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        onPressArrowRight={addMonth => addMonth()}
                        // Disable left arrow. Default = false
                        disableArrowLeft={false}
                        // Disable right arrow. Default = false
                        disableArrowRight={false}
                        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                        disableAllTouchEventsForDisabledDays={true}
                        />

                        <View style={Styles.titleNameDate}>
                            <Text>{this.state.textDayName}</Text>
                        </View>

                        <View style={Styles.line}>
                            <Text>Morning shift</Text>
                            <Text>Lunch shift</Text>
                            <Text>Evening shift</Text>
                        </View>


                        <View style={Styles.line}>
                            <TouchableOpacity>
                                <Text style={Styles.notAvailable} onPress = {() => this.update_select_prefers({typeOfShift : 0, availability: 0})}>not Available</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.notAvailable} onPress = {() => this.update_select_prefers({typeOfShift : 1, availability: 0})}>not Available</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.notAvailable} onPress = {() => this.update_select_prefers({typeOfShift : 2, availability: 0})}>not Available</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.line}>
                            <TouchableOpacity>
                                <Text style={Styles.Available} onPress = {() => this.update_select_prefers({typeOfShift : 0, availability: 1})}>Available</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.Available } onPress = {() => this.update_select_prefers({typeOfShift : 1, availability: 1})}>Available</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.Available} onPress = {() => this.update_select_prefers({typeOfShift : 2, availability: 1})}>Available</Text>
                            </TouchableOpacity>

                        </View>
                            
                        <View style={Styles.line}>
                            <TouchableOpacity>
                            <Text style={Styles.Prefer} onPress = {() => this.update_select_prefers({typeOfShift : 0, availability: 2})}>Prefer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.Prefer} onPress = {() => this.update_select_prefers({typeOfShift : 1, availability: 2})}>Prefer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={Styles.Prefer} onPress = {() => this.update_select_prefers({typeOfShift : 2, availability: 2})}>Prefer</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={Styles.sendArea}>
                            <Text style={Styles.sendText} onPress = {() => this.send_shift_weekly_data()}>SEND</Text>
                        </TouchableOpacity>

            </View>
        
        );
    }
    }

    
    const Styles = StyleSheet.create({
        titleNameDate : {
            alignSelf:'center',

        },
        sendText: {
            alignSelf:'center',

        },
        sendArea:
        {
            backgroundColor: '#c8fa48',
            paddingVertical: 10,
        },
        line:
        {
            flexDirection : 'row',
            alignItems: 'stretch',
            justifyContent: 'space-between',
        },
        notAvailable:
        {
            color: '#ff0d41',
            fontWeight:'700',
        },
        Available:
        {
            color: '#1ff2f2',
            fontWeight:'700', 
        },
        Prefer:
        {
            color: '#000cb8',
            fontWeight:'700',
        },

    });


