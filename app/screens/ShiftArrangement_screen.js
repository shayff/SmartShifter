import React, {useState, Component} from 'react';
import {AsyncStorage,FlatList,ActivityIndicator,StyleSheet, Text, View,ScrollView, Alert } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {Calendar} from 'react-native-calendars';
import Moment from 'moment';
import meneger_server from '../networking/shiftManager_server';
import SingleShift from '../component/shift_arrangement/singleShift';


export default class Weekly_shift_arrangement extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            dataArrangement:{},
            allSections: [
                {
                    title: 'Morning',
                    content: [],
                  },
                  {
                    title: 'Noon',
                    content: [],
                  },
                  {
                    title: 'Evening',
                    content:  [],
                  },
                ],
            activeSections:[],
            markedDates: {},
            rangeToSelect: ['','select day',''], // [minDat,currentDay,maxDay] to choose on the borde,
            isLodingDataMonth: true,
      }
    }

    getCurrentDate=()=>{

      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();

      
      //Alert.alert(date + '-' + month + '-' + year);
      // You can turn it in to your desired format
      let res = {
        'year': year,
        'month': month,
        'day': date,
        'dateString':year+"-"+month+"-"+date
      }
      return res; //date + '-' + month + '-' + year;//format: dd-mm-yyyy;
}
    // function that call after the constractor 
    componentDidMount(){

      let today = this.getCurrentDate();
      this.updateShiftInBorde(today);
    }

  _renderHeader = section => {
    return (
      <View>
        <Text style={Styles.AccordionHeader}>{section.title}</Text>
      </View>
    );
  };
 
  _renderContent = section => {
    return (
      <View>
        {section.content.map(item => (
              <View key={item.id}>
                <SingleShift item={item}/>
              </View>
        ))}


      </View>
    );
  };
 
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  _renderSectionTitle = section => {
    return (
      <View></View>
    );
  };

  formatDay = (date) =>
  {
    let newMonth=0;
    let newDay=0;

    if (date.month<10)
    {
      newMonth= '0'+date.month;
    }
    else
    {
      newMonth = date.month;
    }

    if(date.day < 10)
    {
      newDay = '0'+newDay.day;
    }
    else
    {
      newDay = date.day;
    }

    let res = {
      'year': date.year,
      'month': newMonth,
      'day': newDay,
      'dateString':date.year+"-"+newMonth+"-"+newDay
    }

    return res;
    
  }

  updateShiftInBorde = async (dateSelect) =>
  {
    this.setState({isLodingDataMonth:true});

    let formatCurrentDay = this.formatDay(this.getCurrentDate());
    console.log(formatCurrentDay);
    
    let formatDateSelect = this.formatDay(dateSelect);


    let minDateShift = formatDateSelect.year+'-'+(formatDateSelect.month)+'-01';
    // get the lest day in this month
    var lestDay = new Date(formatDateSelect.year, formatDateSelect.month, 0);
    let maxDateShift = Moment(lestDay).format('YYYY-MM-DD');

    // talk to the server
    let toSent = {
      "start_date": minDateShift,
      "end_date": maxDateShift,
      "statuses": ["scheduled"]
    }

    console.log(toSent);

    let token = await AsyncStorage.getItem('token');
    let _id = await AsyncStorage.getItem('_id');
    
    let ShiftMonth = await meneger_server.post('/GetShifts',
    toSent,
     {
          headers: {
              Authorization: "Bearer " + token
          }
      }).then(response => {
        return  response.data;
      }).catch(err => {
        Alert.alert("something get wrong, please try again");
      });
    //let ShiftMonth = get_shift_from_server(toSent);

    this.setState({dataArrangement:ShiftMonth});


    // start to uplode the borde the shifts
    let tempMarksDays = {};
    var self = this;

     Object.keys(ShiftMonth.data).forEach(function (item) {

      tempMarksDays[item]= {startingDay: true,textColor:'black', color: '#50cebb', endingDay: true};
      let date = ShiftMonth.data[item];

      for(let i=0; i<date.length; i++) // passing all the shift in this day
      {
        let EmployeesArray = date[i]["employees"];
          for(let i=0; i<EmployeesArray.length;i++)
          {
            if(EmployeesArray[i]["_id"] == _id) // need to put her ID
            {
              tempMarksDays[date[i]["date"]] = {marked: true,startingDay: true, textColor:'black', color: '#50cebb',dotColor: '#ffff', endingDay: true};
            }
          }
      }

      });

      let currentDay = tempMarksDays[formatCurrentDay.dateString];

      if(currentDay == null) // if there are no mark object in this day
      {
        currentDay= {textColor:'#7d2934'}; //mast not white
      }
      else
      {
        currentDay["textColor"]= '#7d2934';//mast not white
      }
      tempMarksDays[formatCurrentDay.dateString] = currentDay;

      this.setState({markedDates:tempMarksDays});

      this.setState({isLodingDataMonth:false});

  }

  update_shift_for_this_day = (day) =>
  {
    this.setState({isLodingDataMonth:true});

    let demoToRender = ['',day.dateString,''];

    this.setState({rangeToSelect:demoToRender});

    let resSshiftToUpdate = [
      {
          title: 'Morning',
          content: [],
        },
        {
          title: 'Noon',
          content: [],
        },
        {
          title: 'Evening',
          content: [],
        },
      ];

      
      let shift = this.state.dataArrangement.data[day.dateString];
      
      if (shift != null)
      {
        for(let i=0; i<shift.length; i++) // passing all the shift in this day
        {
          this.put_shift_in_borde({oneShift:shift[i],sections:resSshiftToUpdate});
        }
      }

      this.setState({allSections:resSshiftToUpdate});
      this.setState({isLodingDataMonth:false});

  }

  put_shift_in_borde = (data) =>
  {

   if(data.oneShift["day part"].includes(0))
   {
    this.write_shift_details({shiftDetails:data.oneShift, sections: data.sections[0]});
   }
   else if(data.oneShift["day part"].includes(1))
   {
    this.write_shift_details({shiftDetails:data.oneShift, sections: data.sections[1]});
   }
   else
   {
    this.write_shift_details({shiftDetails:data.oneShift, sections: data.sections[2]});
   }
  }

  write_shift_details = (shift) =>
  {
    let empArray = shift.shiftDetails["employees"];

    let arryEMP=[]
    for (let i=0; i<empArray.length;i++)
    {
      let tempEMP ={
        "first name": empArray[i]["first name"],
        "last name": empArray[i]["last name"],
        "_id": empArray[i]["_id"],
      } 
      arryEMP.push(tempEMP)
    }
    
    let temp = {
      "title": shift.shiftDetails["job type"],
      "start time": shift.shiftDetails["start time"],
      "end time": shift.shiftDetails["end time"],
      "employees": arryEMP,
      "id": shift.shiftDetails["id"],
    }

    shift.sections.content.push(temp);

    // shift.sections.content += "title: "+shift.shiftDetails["job type"]+"||"
    //                         +"start time: "+shift.shiftDetails["start time"]+"||"
    //                         +"end time: "+shift.shiftDetails["end time"]+"||"
    //                         +"note: "+shift.shiftDetails["note"]+"||"
    //                         +"employees: ";

    // let empArray = shift.shiftDetails["employees"];

    // for (let i=0; i<empArray.length;i++)
    // {
    //   shift.sections.content += empArray[i]["first name"]+" "+empArray[i]["last name"]+ ", ";
    // }
    // shift.sections.content += '\n';     

  }

  get_shift_from_server = (data) =>
  {

  }

  

    render() {  
        return(
            
            <ScrollView style={Styles.content}>

              <View>
              <Calendar
                        // Collection of dates that have to be marked. Default = {}
                        markedDates={this.state.markedDates}
                         // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                        markingType={'period'}
                        // Initially visible month. Default = Date()
                        current={this.state.rangeToSelect}
                        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                        minDate={this.state.rangeToSelect[2]}
                        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                        maxDate={this.state.rangeToSelect[0]}
                        // Handler which gets executed on day press. Default = undefined
                        onDayPress={(day) => {this.update_shift_for_this_day(day)}}
                        // Handler which gets executed on day long press. Default = undefined
                        onDayLongPress={(day) => {}}
                        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        monthFormat={'yyyy MM'}
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(day) => {this.updateShiftInBorde(day)}}
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
                        onPressArrowLeft={subtractMonth => subtractMonth()}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        onPressArrowRight={addMonth => addMonth()}
                        // Disable left arrow. Default = false
                        disableArrowLeft={false}
                        // Disable right arrow. Default = false
                        disableArrowRight={false}
                        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                        disableAllTouchEventsForDisabledDays={true}
                        /** Replace default month and year title with custom one. the function receive a date as parameter. */
                        renderHeader={(date) => {/*Return JSX*/}}
                      />

              </View>

            <Text style={Styles.dateShow}>{this.state.rangeToSelect[1]}</Text>
            <View>
                {this.state.rangeToSelect[1] == 'select day' ? ((this.state.isLodingDataMonth ?(
                                    <View>
                                      <ActivityIndicator  size="large" color="#0000ff" />
                                    </View>):(null))):(this.state.isLodingDataMonth ?(
                                    <View>
                                      <ActivityIndicator  size="large" color="#0000ff" />
                                    </View>):(
                                    <View>
                                        <Accordion
                                            sections={this.state.allSections}
                                            activeSections={this.state.activeSections}
                                            renderSectionTitle={this._renderSectionTitle}
                                            renderHeader={this._renderHeader}
                                            renderContent={this._renderContent}
                                            onChange={this._updateSections}/>
                                      </View>))}
                </View>


            </ScrollView>
        
        );
    }
}

    
const Styles = StyleSheet.create({
    UnselectButton : {
        borderColor: '#f5f5f5',
        borderWidth: 4,
        borderRadius: 10,
    },
    content:
    {
      backgroundColor:'#36485f',

    },
    dateShow:
    {
      textAlign: 'center',
      backgroundColor:'#1ac4b0',
      fontSize:18,
      fontWeight: 'bold',
      color:'#ffff',

    },
    AccordionHeader:
    {
      textAlign: 'center',
      color:'#ffff',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor:'#2980b9',
    },
    container:
    {
        flex:1,
        backgroundColor:'#36485f',
    },
    selectButton : {
        borderColor: '#5fe39d',
        borderWidth: 4,
        borderRadius: 10,

    },
    line:
    {
        width: 60,
        flexDirection : 'row',
        alignItems: 'stretch',
        
    },
});

