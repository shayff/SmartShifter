import React, { Component } from 'react'
import moment from 'moment'
import { submitWantedShift } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class EditPreferences extends Component {
   constructor() {
      super()
      this.state = {
         sunday:moment().day(7),
         monday:moment().day(8),
         tuesday:moment().day(9),
         wednesday:moment().day(10),
         thursday:moment().day(11),
         friday:moment().day(12),
         saturday:moment().day(13),
      }

      this.onSubmit = this.onSubmit.bind(this)
  }

    onClickButton(id){
       const substring = "btn-success";
       const current_class = document.getElementById(id).className ;
      if(current_class.includes(substring))
      {
         document.getElementById(id).className = "btn btn-lg btn-secondary btn-block btn2";
      }
      else
      {
         document.getElementById(id).className = "btn btn-lg btn-success btn-block btn2";
      }
     }

     onClickMarkAllButton(class_name){
      const substring = "btn-success";
      let current_class = document.getElementsByClassName(class_name);
      current_class = Array.from(current_class);
      current_class.map(function(button)
      {
         if(button.className.includes(substring))
         {
            button.className = "btn btn-lg btn-secondary btn-block btn2";
         }
         else
         {
            button.className = "btn btn-lg btn-success btn-block btn2";
         }
         return null
      });
    }
    
    onSubmit (e) {
      e.preventDefault()

      let shifts = {
         sunday:{
            date:this.state.sunday.format('YYYY-MM-DD'),
            preference:[]
         },
         monday:{
            date:this.state.monday.format('YYYY-MM-DD'),
            preference:[]
         },
         tuesday:{
            date:this.state.tuesday.format('YYYY-MM-DD'),
            preference:[]
         },
         wednesday:{
            date:this.state.wednesday.format('YYYY-MM-DD'),
            preference:[]
         },
         thursday:{
            date:this.state.thursday.format('YYYY-MM-DD'),
            preference:[]
         },
         friday:{
            date:this.state.friday.format('YYYY-MM-DD'),
            preference:[]
         },
         saturday:{
            date:this.state.saturday.format('YYYY-MM-DD'),
            preference:[]
         }
      }
      
      let preferences = document.getElementsByClassName("btn-success");
      preferences = Array.from(preferences);
      for(let i=0; i<preferences.length; i++)
      {
         this.parsePreferences(preferences[i].id,shifts);
      }

         submitWantedShift(shifts).then(res => {
            this.props.history.push(`/generateShifts`)
      });
  }

  parsePreferences(preferences,shifts)
  {
      switch(preferences)
      {
         case 'Morning1':shifts.sunday.preference.push(0); break;  
         case 'Morning2':shifts.monday.preference.push(0); break;  
         case 'Morning3':shifts.tuesday.preference.push(0); break;  
         case 'Morning4':shifts.wednesday.preference.push(0); break;  
         case 'Morning5':shifts.thursday.preference.push(0); break;  
         case 'Morning6':shifts.friday.preference.push(0); break;  
         case 'Morning7':shifts.saturday.preference.push(0); break;  
         case 'Afternoon1':shifts.sunday.preference.push(1);  break;  
         case 'Afternoon2':shifts.monday.preference.push(1); break;  
         case 'Afternoon3':shifts.tuesday.preference.push(1); break;  
         case 'Afternoon4':shifts.wednesday.preference.push(1); break;  
         case 'Afternoon5':shifts.thursday.preference.push(1); break;  
         case 'Afternoon6':shifts.friday.preference.push(1); break;  
         case 'Afternoon7':shifts.saturday.preference.push(1); break;  
         case 'Evening1':shifts.sunday.preference.push(2);  break;  
         case 'Evening2':shifts.monday.preference.push(2); break;  
         case 'Evening3':shifts.tuesday.preference.push(2); break;  
         case 'Evening4':shifts.wednesday.preference.push(2); break;  
         case 'Evening5':shifts.thursday.preference.push(2); break;  
         case 'Evening6':shifts.friday.preference.push(2); break;  
         case 'Evening7':shifts.saturday.preference.push(2); break;  
         default:;
      }
  }

  initializeTable(dayPart)
  {
      let btn_class = "btn btn-lg btn-success btn-block btn2";

      return(
         <tr>
         <th scope="row">
            <button id={dayPart + "1"} type="button" className= {btn_class} onClick={() => this.onClickButton(dayPart + "1")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "2"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "2")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "3"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "3")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "4"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "4")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "5"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "5")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "6"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "6")}>{dayPart}</button>
         </th>
         <th scope="row">
            <button id={dayPart + "7"} type="button" className={btn_class} onClick={() => this.onClickButton(dayPart + "7")}>{dayPart}</button>
         </th>
         </tr>);
  }

    render () {        
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <form name="myForm8" onSubmit={this.onSubmit}>
                <div className="jumbotron mt-5" style={{display: 'inline-block'}}>
                    <div className="col-sm-8 mx-auto">
                         <h1 className="text-center">Employee Preferences</h1>                
                    </div><br/>
                    <table className="table table-bordered ">
                        <thead className="thead-dark">                          
                            <tr>    
                            <th scope="col" className="text-center"> {this.state.sunday.format('YYYY-MM-DD')} Sunday</th>
                            <th scope="col" className="text-center"> {this.state.monday.format('YYYY-MM-DD')} Monday</th>
                            <th scope="col" className="text-center"> {this.state.tuesday.format('YYYY-MM-DD')} Tuesday</th>
                            <th scope="col" className="text-center"> {this.state.wednesday.format('YYYY-MM-DD')} Wednesday</th>
                            <th scope="col" className="text-center"> {this.state.thursday.format('YYYY-MM-DD')} Thursday</th>
                            <th scope="col" className="text-center"> {this.state.friday.format('YYYY-MM-DD')} Friday</th>
                            <th scope="col" className="text-center"> {this.state.saturday.format('YYYY-MM-DD')} Saturday</th>                     
                            </tr>
                        </thead>
                        <tbody>
                           {this.initializeTable('Morning')}
                           {this.initializeTable('Afternoon')}
                           {this.initializeTable('Evening')}
                        </tbody>
                        </table>
                </div>
                      <button type="button" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '1.5%'}} onClick={() => this.onClickMarkAllButton("btn2")}>
                                Mark All
                      </button>  
                      <button type="submit" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '1.5%'}}>
                                Sumbit Changes
                      </button>  
                      </form>
            </div>
        )
    }
}

export default withRouter(EditPreferences)