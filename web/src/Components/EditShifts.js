import React, { Component } from 'react'
import moment from 'moment'
import { submitWantedShift } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class EditShifts extends Component {
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
         lastSunday:moment().day(7),
         previousDisabled:true
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

   //  onClickNextWeek(){
   //    this.setState({
   //       sunday: moment(this.state.sunday, "YYYY-MM-DD").add(7, 'days'),
   //       monday: moment(this.state.monday, "YYYY-MM-DD").add(7, 'days'),
   //       tuesday: moment(this.state.tuesday, "YYYY-MM-DD").add(7, 'days'),
   //       wednesday: moment(this.state.wednesday, "YYYY-MM-DD").add(7, 'days'),
   //       thursday: moment(this.state.thursday, "YYYY-MM-DD").add(7, 'days'),
   //       friday: moment(this.state.friday, "YYYY-MM-DD").add(7, 'days'),
   //       saturday: moment(this.state.saturday, "YYYY-MM-DD").add(7, 'days'),
   //       previousDisabled:false
   //    });
   //  }

   //  onClickPreviousWeek(){
   //     if(this.state.lastSunday<=moment(this.state.sunday, "YYYY-MM-DD").add(-7, 'days'))
   //     {
   //       this.setState({
   //          sunday:moment(this.state.sunday, "YYYY-MM-DD").add(-7, 'days'),
   //          monday:moment(this.state.monday, "YYYY-MM-DD").add(-7, 'days'),
   //          tuesday:moment(this.state.tuesday, "YYYY-MM-DD").add(-7, 'days'),
   //          wednesday:moment(this.state.wednesday, "YYYY-MM-DD").add(-7, 'days'),
   //          thursday:moment(this.state.thursday, "YYYY-MM-DD").add(-7, 'days'),
   //          friday:moment(this.state.friday, "YYYY-MM-DD").add(-7, 'days'),
   //          saturday:moment(this.state.saturday, "YYYY-MM-DD").add(-7, 'days'),
   //          previousDisabled:false
   //       });
   //     }
   //    else{
   //       this.setState({
   //          previousDisabled:true
   //       })
   //    }
   //  }
    
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
            this.props.history.push(`/shifts`)
      });
  }

  parsePreferences(preferences,shifts)
  {
   switch(preferences)
   {
      case 'M1':shifts.sunday.preference.push(0); break;  
      case 'M2':shifts.monday.preference.push(0); break;  
      case 'M3':shifts.tuesday.preference.push(0); break;  
      case 'M4':shifts.wednesday.preference.push(0); break;  
      case 'M5':shifts.thursday.preference.push(0); break;  
      case 'M6':shifts.friday.preference.push(0); break;  
      case 'M7':shifts.saturday.preference.push(0); break;  
      case 'A1':shifts.sunday.preference.push(1);  break;  
      case 'A2':shifts.monday.preference.push(1); break;  
      case 'A3':shifts.tuesday.preference.push(1); break;  
      case 'A4':shifts.wednesday.preference.push(1); break;  
      case 'A5':shifts.thursday.preference.push(1); break;  
      case 'A6':shifts.friday.preference.push(1); break;  
      case 'A7':shifts.saturday.preference.push(1); break;  
      case 'E1':shifts.sunday.preference.push(2);  break;  
      case 'E2':shifts.monday.preference.push(2); break;  
      case 'E3':shifts.tuesday.preference.push(2); break;  
      case 'E4':shifts.wednesday.preference.push(2); break;  
      case 'E5':shifts.thursday.preference.push(2); break;  
      case 'E6':shifts.friday.preference.push(2); break;  
      case 'E7':shifts.saturday.preference.push(2); break;  
      default:;
   }
  }

    render () {
        let btn_class = "btn btn-lg btn-success btn-block btn2";
        
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <form name="myForm8" onSubmit={this.onSubmit}>
                <div className="jumbotron mt-5" style={{display: 'inline-block'}}>
                    <div className="col-sm-8 mx-auto">
                         <h1 className="text-center">Edit Shifts</h1>                
                    </div>
                    <table className="table table-borderless">
                    {/* <thead>                          
                            <tr>    
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary btn-block" disabled={this.state.previousDisabled} onClick={() => this.onClickPreviousWeek()}>
                                Previous Week
                            </button></th>                     
                            <th scope="col"></th>                     
                            <th scope="col"></th>                     
                            <th scope="col"></th>                     
                            <th scope="col"></th>                     
                            <th scope="col"></th>                     
                            <th scope="col" ><button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onClickNextWeek()}>
                                Next Week
                            </button></th>                     
                            </tr>
                        </thead> */}
                    </table>
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
                            <tr>
                            <th scope="row">
                               <button id="M1" type="button" className= {btn_class} onClick={() => this.onClickButton("M1")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M2" type="button" className={btn_class} onClick={() => this.onClickButton("M2")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M3" type="button" className={btn_class} onClick={() => this.onClickButton("M3")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M4"  type="button" className={btn_class} onClick={() => this.onClickButton("M4")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M5" type="button" className={btn_class} onClick={() => this.onClickButton("M5")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M6" type="button" className={btn_class} onClick={() => this.onClickButton("M6")}>Morning</button>
                            </th>
                            <th scope="row">
                               <button id="M7"  type="button" className={btn_class} onClick={() => this.onClickButton("M7")}>Morning</button>
                            </th>
                            </tr>
                            <tr>
                            <th scope="row">
                               <button id="A1" type="button" className={btn_class} onClick={() => this.onClickButton("A1")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A2" type="button" className={btn_class} onClick={() => this.onClickButton("A2")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A3" type="button" className={btn_class} onClick={() => this.onClickButton("A3")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A4" type="button" className={btn_class} onClick={() => this.onClickButton("A4")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A5" type="button" className={btn_class} onClick={() => this.onClickButton("A5")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A6" type="button" className={btn_class} onClick={() => this.onClickButton("A6")}>Afternoon</button>
                            </th>
                            <th scope="row">
                               <button id="A7" type="button" className={btn_class} onClick={() => this.onClickButton("A7")}>Afternoon</button>
                            </th>
                            </tr>
                            <tr>
                            <th scope="row">
                               <button id="E1" type="button" className={btn_class} onClick={() => this.onClickButton("E1")}>Evening</button>
                            </th>
                            <th scope="row">
                               <button id="E2" type="button" className={btn_class} onClick={() => this.onClickButton("E2")}>Evening</button>
                            </th>
                            <th scope="row">
                               <button id="E3" type="button" className={btn_class} onClick={() => this.onClickButton("E3")}>Evening</button>
                            </th>                                                           
                            <th scope="row">
                               <button id="E4" type="button" className={btn_class} onClick={() => this.onClickButton("E4")}>Evening</button>
                            </th>
                            <th scope="row">
                               <button id="E5" type="button" className={btn_class} onClick={() => this.onClickButton("E5")}>Evening</button>
                            </th>
                            <th scope="row">
                               <button id="E6" type="button" className={btn_class} onClick={() => this.onClickButton("E6")}>Evening</button>
                            </th>
                            <th scope="row">
                               <button id="E7" type="button" className={btn_class} onClick={() => this.onClickButton("E7")}>Evening</button>
                            </th>
                            </tr>
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

export default withRouter(EditShifts)