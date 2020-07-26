import React, { Component } from 'react'
import { buildShifts, ListOfEmployees } from './UserFunctions'
// import Scheduler from './Scheduler'
// import './Scheduler.css'
import moment from 'moment'

class GenerateShifts extends Component {
    constructor() {
        super()
        this.state = {
            arrEmployees:[],
            sunday:moment().day(7),
            monday:moment().day(8),
            tuesday:moment().day(9),
            wednesday:moment().day(10),
            thursday:moment().day(11),
            friday:moment().day(12),
            saturday:moment().day(13),
            hours:["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00",
                   "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
        }

        this.onSubmit = this.onSubmit.bind(this)
    }
     
    componentDidMount()
    {
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                this.setState({arrEmployees: employees});
            }
         });
    };

    initializeOptions = () => { 
        return this.state.arrEmployees.map((employee,index) => (
        <option key={index + 1} value= {employee["_id"]} >{employee["first name"]} {employee["last name"]}</option>
        ));
  }

    initializeTable()
    {
        const sunday= "table-light shifts 1";
        const monday= "table-light shifts 2";
        const tuesday= "table-light shifts 3";
        const wednesday= "table-light shifts 4";
        const thursday= "table-light shifts 5";
        const friday= "table-light shifts 6";
        const saturday= "table-light shifts 7";
        const hoursColor= "table-info";

       return this.state.hours.map((hours,index) => (
            <tr key={index}>
            <th scope="row" className={hoursColor}>{hours}</th>
            <th scope="row" id={"sunday" + index} className={sunday}><input type="text"></input></th>
            <th scope="row" id={"monday" + index} className={monday}><textarea></textarea></th>
            <th scope="row" id={"tuesday" + index} className={tuesday}><select> <option value="All"></option > {this.initializeOptions()}</select></th>
            <th scope="row" id={"wednesday" + index} className={wednesday}></th>
            <th scope="row" id={"thursday" + index} className={thursday}></th>
            <th scope="row" id={"friday" + index} className={friday}></th>
            <th scope="row" id={"saturday" + index} className={saturday}></th>
            </tr>
            ));
    }

    onSubmit (e) {
        e.preventDefault()
    
    
    
         buildShifts(/**/).then(res => {
           this.props.history.push(`/shifts`)})
    }

    render () {
        return (
            <div className="container">
            <div className="jumbotron mt-5">
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Shifts </h1>
             </div>
             {/* <div className='scheduler-container'>
                <Scheduler/> */}
                <table className="table table-bordered ">
                    <thead className="thead-dark">                          
                        <tr>    
                        <th scope="col">#</th>
                        <th scope="col"> {this.state.sunday.format('YYYY-MM-DD')} Sunday</th>
                        <th scope="col"> {this.state.monday.format('YYYY-MM-DD')} Monday</th>
                        <th scope="col"> {this.state.tuesday.format('YYYY-MM-DD')} Tuesday</th>
                        <th scope="col"> {this.state.wednesday.format('YYYY-MM-DD')} Wednesday</th>
                        <th scope="col"> {this.state.thursday.format('YYYY-MM-DD')} Thursday</th>
                        <th scope="col"> {this.state.friday.format('YYYY-MM-DD')} Friday</th>
                        <th scope="col"> {this.state.saturday.format('YYYY-MM-DD')} Saturday</th>                     
                        </tr>
                    </thead>
                    <tbody>
                    {this.initializeTable()}
                    </tbody>
                 </table>
             </div>  
            {/* </div>  */}
                <button type="submit" className="btn btn-lg btn-primary btn-block">
                    Generate Shifts
                </button>  
            </div>
        )
    }
}

export default GenerateShifts

/* <div className="container">
<div className="jumbotron mt-5">
    <div className="col-sm-8 mx-auto">
         <h1 className="text-center">Generate Shifts</h1>
    </div>
    <table className="table table-bordered ">
        <thead className="thead-dark">
            <tr>
            <th scope="col">Sunday</th>
            <th scope="col">Monday</th>
            <th scope="col">Tuesday</th>
            <th scope="col">Wednesday</th>
            <th scope="col">Thursday</th>
            <th scope="col">Friday</th>
            <th scope="col">Saturday</th>                     
            </tr>
        </thead>
        <tbody>
            <tr>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            <th scope="row">Morning</th>
            </tr>
            <tr>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            <th scope="row">Afternoon</th>
            </tr>
            <tr>
            <th scope="row">Evening</th>
            <th scope="row">Evening</th>                                 
            <th scope="row">Evening</th>                                 
            <th scope="row">Evening</th>                                 
            <th scope="row">Evening</th>                                 
            <th scope="row">Evening</th>                                 
            <th scope="row">Evening</th>                                                              
            </tr>
        </tbody>
        </table>
</div>
      <button type="submit" className="btn btn-lg btn-primary btn-block">
               Generate 
    </button>                
</div> */