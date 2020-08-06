import React, { Component } from 'react'
import { buildShifts, ListOfEmployees,getShifts,removeShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class GenerateShifts extends Component {
    constructor() {
        super()
        this.state = {
            arrShiftsNotScheduled :[],
            arrEmployees:[],
            sunday:moment().day(7),
            monday:moment().day(8),
            tuesday:moment().day(9),
            wednesday:moment().day(10),
            thursday:moment().day(11),
            friday:moment().day(12),
            saturday:moment().day(13)
        }

        this.onSubmit = this.onSubmit.bind(this)
    }
     
    updateDatesAndGetShifts()
    {
        const minDate = moment().day(7).format('YYYY-MM-DD');
        const maxDate = moment().day(13).format('YYYY-MM-DD');
  
         const shifts ={
             start_date: minDate, 
             end_date: maxDate,
             statuses: ['not_scheduled'] 
         }
         
         getShifts(shifts).then(shifts =>{
            if(shifts){
                let newShifts = [];
                this.parseShifts(shifts,newShifts,minDate,maxDate);
                if(newShifts.length !== 0)
                {
                   this.setState({ arrShiftsNotScheduled:newShifts});
                }
                else
                {
                   alert("No Shifts To Show")
                }
              }
            })
    }

    parseShifts(shifts,newShifts,minDate,maxDate)
    {
        let j = 0;
        let date = minDate;
  
        while(date <= maxDate)
        {
            if(shifts[date])
            {
                for(let i=0; i<shifts[date].length; i++)
                {
                   newShifts.push(shifts[date][i])
                }
            }
            j++;
            date = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }
    }

    componentDidMount()
    {
        this.updateDatesAndGetShifts();
        
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                this.setState({arrEmployees: employees});
            }
         });
    };

    ParseDayParts(dayParts)
    {
        let dayPartsString = '';
        for(let i=0; i<dayParts.length; i++)
        {
            if(dayParts[i] === 0)
            {
                dayPartsString+='Morning '
            }
            else if(dayParts[i] === 1)
            {
                dayPartsString+='Afternoon '
            }
            else
            {
                dayPartsString+='Evening '
            }
        }

        return dayPartsString;
    }

    onRemoveShift(id)
    {
        removeShift(id).then(()=> {
            this.updateDatesAndGetShifts();
       });
    }

    onUpdateInfoShift(path, shift) {
        this.props.history.push(path, { detail: shift})
   }

    initializeTableModal(shift,index)
    {
        const modalButton = '#exampleModal' + index;
        const ModalId = "exampleModal" + index;
        const modalLabel = 'exampleModalLabel' + index;
 
        return(
        <div key = {index} style={{padding:'5px'}}>
            <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target={modalButton}>
                {shift.name}
            </button>
            <div className="modal fade" id={ModalId} tabIndex="-1" aria-labelledby={modalLabel} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                    <div className="modal-header text-center">
                        <h3 className="modal-title w-100" id={modalLabel}>Details About The Shift</h3>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">            
                    <div className="container">
                    <table className="table table-bordered">
                        <tbody>
                            <tr className="text-center">
                                <td className="table-primary">Name Of The Shift</td>
                                <td className="table-secondary">{shift.name}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Date Of The Shift</td>
                                <td className="table-secondary">{shift.date}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Start Time Of The Shift</td>
                                <td className="table-secondary">{shift["start time"]}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">End Time Of The Shift</td>
                                <td className="table-secondary">{shift["end time"]}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Job Type For The Shift</td>
                                <td className="table-secondary">{shift["job type"]}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Difficulty Of The Shift</td>
                                <td className="table-secondary">{shift.difficulty}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Day Part Of The Shift</td>
                                <td className="table-secondary">{this.ParseDayParts(shift["day part"])}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Amount Of Employees</td>
                                <td className="table-secondary">{shift.amount}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Employees For The Shift</td>
                                <td className="table-secondary">{shift.employees.map((employee) => (
                                    employee["first name"] + " " + employee["last name"] + ", "))}</td>
                            </tr>
                            <tr className="text-center">
                                <td className="table-primary">Note For The Shift</td>
                                <td className="table-secondary">{shift.note}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.onUpdateInfoShift(`/updateShift`,shift)}>
                            Update Shift
                        </button>
                        <button type="button" className="btn btn-primary"  data-dismiss="modal" onClick={() => this.onRemoveShift(shift.id)}>
                            Remove Shift
                        </button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </div>)
    }

    initializeTable()
    {
       return (<tr>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.sunday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.monday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.tuesday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.wednesday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.thursday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.friday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrShiftsNotScheduled.map((shift,index) => (
                    shift.date === this.state.saturday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
            </tr>
            );
    }

    onAddShifts(path)
    {
        this.props.history.push(path);
    }

    onSubmit (e) {
        e.preventDefault()
    
    
    
         buildShifts(/**/).then(res => {
           this.props.history.push(`/shifts`)})
    }

    render () {
        return (
            <div className="container">
            <form name="myForm15" onSubmit={this.onSubmit}>
            <div className="jumbotron mt-5">
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Build Shifts </h1>
             </div>
                <table className="table table-bordered">
                    <thead className="thead-dark">                          
                        <tr className="text-center">    
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
             <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAddShifts(`/addShifts`)}>
                                Add Shifts 
                </button>   
                <button type="submit" className="btn btn-lg btn-primary btn-block">
                    Generate Shifts
                </button>  
                </form>
            </div>
        )
    }
}

export default withRouter(GenerateShifts)


/*

import React, { Component } from 'react'
import { buildShifts, ListOfEmployees } from './UserFunctions'
// import Scheduler from './Scheduler'
// import './Scheduler.css'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

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

    onAddShifts(path)
    {
        this.props.history.push(path);
    }

    onSubmit (e) {
        e.preventDefault()
    
    
    
         buildShifts().then(res => {
            this.props.history.push(`/shifts`)})
        }npm 
    
        render () {
            return (
                <div className="container">
                <div className="jumbotron mt-5">
                 <div className="col-sm-8 mx-auto">
                    <h1 className="text-center"> Build Shifts </h1>
                 </div>
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
                 <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAddShifts(`/addShifts`)}>
                                    Add Shifts 
                    </button>   
                    <button type="submit" className="btn btn-lg btn-primary btn-block">
                        Generate Shifts
                    </button>  
                </div>
            )
        }
    }
    
    export default withRouter(GenerateShifts)    
*/