import React, { Component } from 'react'
import { getShifts } from './UserFunctions'
import Scheduler from './Scheduler'
import './Scheduler.css'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

<<<<<<< HEAD
=======

import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

>>>>>>> 8d785dbb7d0304e0e61ecbc06249f33ec36d98fc
class Shifts extends Component {
    _isMounted = false;

    constructor() {
        super();
     this.state = {
        weeklyShifts : [],
        parsedWeeklyShifts : [],
        };
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount()
    {
        this._isMounted = true;

        // window.scheduler.attachEvent("onClick", function (id, e){
        //     this.onClickShift(parseInt(id))
        //     return false;
        // }.bind(this));
        window.scheduler.attachEvent("onViewChange", function (new_mode , new_date){this.updateDatesAndGetShifts()}.bind(this));
        this.updateDatesAndGetShifts();
    };

    // onClickShift(shiftID)
    // {
    //     const shifts = this.state.weeklyShifts;
    //     const currMinDate = window.scheduler.getState().min_date;
    //     const currMaxDate = window.scheduler.getState().max_date;
    //     const minDate = moment(currMinDate, "YYYY-MM-DD").add(0, 'days').format('YYYY-MM-DD');
    //     const maxDate = moment(currMaxDate, "YYYY-MM-DD").add(-1, 'days').format('YYYY-MM-DD');
    //     let j = 0;
    //     let startDate = minDate;

    //     while(startDate <= maxDate)
    //     {
    //         if(shifts[startDate])
    //         {
    //             for(let i=0; i<shifts[startDate].length; i++)
    //             {
    //                 if((shifts[startDate][i])["id"] === shiftID)
    //                 {
    //                     console.log((shifts[startDate][i]))
    //                     return this.initializeTableModal((shifts[startDate][i]),shiftID)
    //                 }
    //             }
    //         }
            
    //         j++;
    //         startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
    //     }
    // }

    // initializeTableModal(shift,index)
    // {
    //     const modalButton = '#exampleModal' + index;
    //     const ModalId = "exampleModal" + index;
    //     const modalLabel = 'exampleModalLabel' + index;
    //     const shiftIsScheduled= "btn btn-success btn-block";
    //     const shiftIsNotScheduled= "btn btn-info btn-block";
    //     const shiftIsScheduledButNotOk= "btn btn-warning btn-block";

    //     return(
    //     <div key = {index} style={{padding:'5px'}}>
    //         <button type="button" className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? shiftIsScheduled : shiftIsScheduledButNotOk) : shiftIsNotScheduled} data-toggle="modal" data-target={modalButton}>
    //                 {shift.name}<br/>{shift["start_time"]}-{shift["end_time"]}
    //         </button>
    //         <div className="modal fade" data-backdrop="false" id={ModalId} tabIndex="-1" aria-labelledby={modalLabel} aria-hidden="true">
    //             <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    //                 <div className="modal-content">
    //                 <div className="modal-header text-center">
    //                     <h3 className="modal-title w-100" id={modalLabel}>Details About The Shift</h3>
    //                     <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    //                         <span aria-hidden="true">&times;</span>
    //                     </button>
    //                 </div>
    //                 <div className="modal-body">            
    //                 <div className="container">
    //                 <table className="table table-bordered">
    //                     <tbody>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Name Of The Shift</td>
    //                             <td className="table-secondary">{shift.name}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Date Of The Shift</td>
    //                             <td className="table-secondary">{shift.date}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Start Time Of The Shift</td>
    //                             <td className="table-secondary">{shift["start time"]}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">End Time Of The Shift</td>
    //                             <td className="table-secondary">{shift["end time"]}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Job Type For The Shift</td>
    //                             <td className="table-secondary">{shift["job type"]}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Difficulty Of The Shift</td>
    //                             <td className="table-secondary">{shift.difficulty}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Day Part Of The Shift</td>
    //                             <td className="table-secondary">{this.ParseDayParts(shift["day part"])}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-primary" : "table-danger") : "table-primary"}>Amount Of Employees</td>
    //                             <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-secondary" : "table-danger") : "table-secondary"}>{shift.amount}</td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-primary" : "table-danger") : "table-primary"}>Employees For The Shift</td>
    //                             <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-secondary" : "table-danger") : "table-secondary"}>{shift.employees.map((employee,index) => (
    //                                 <div key = {index}>
    //                                   {employee["first_name"] + " " + employee["last_name"]}
    //                                 </div>))}
    //                             </td>
    //                         </tr>
    //                         <tr className="text-center">
    //                             <td className="table-primary">Note For The Shift</td>
    //                             <td className="table-secondary">{shift.note}</td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //                 </div>
    //             </div>
    //                 <div className="modal-footer">
    //                     <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.onUpdateInfoShift(`/updateShift`,shift)}>
    //                         Update Shift
    //                     </button>
    //                     <button type="button" className="btn btn-primary"  data-dismiss="modal" onClick={() => this.onRemoveShift(shift.id)}>
    //                         Remove Shift
    //                     </button>
    //                     <button type="button" className="btn btn-secondary" data-dismiss="modal">
    //                         Close
    //                     </button>
    //                 </div>
    //             </div>
    //             </div>
    //         </div>
    //     </div>)
    // }

    // ParseDayParts(dayParts)
    // {
    //     let dayPartsString = '';
    //     for(let i=0; i<dayParts.length; i++)
    //     {
    //         if(dayParts[i] === 0)
    //         {
    //             dayPartsString+='Morning \n'
    //         }
    //         else if(dayParts[i] === 1)
    //         {
    //             dayPartsString+='Afternoon \n'
    //         }
    //         else
    //         {
    //             dayPartsString+='Evening \n'
    //         }
    //     }

    //     return dayPartsString = dayPartsString.split('\n').map((item, i) => {
    //         return <p key={i}>{item}</p>;
    //     });
    // }

    onGenerateShifts(path) 
    {
        this.props.history.push(path);
    }

    onEditShifts(path)
    {
        this.props.history.push(path);
    }

    updateDatesAndGetShifts()
    {
        const currMinDate = window.scheduler.getState().min_date;
        const currMaxDate = window.scheduler.getState().max_date;
        const minDate = moment(currMinDate, "YYYY-MM-DD").add(0, 'days').format('YYYY-MM-DD');
        const maxDate = moment(currMaxDate, "YYYY-MM-DD").add(-1, 'days').format('YYYY-MM-DD');
  
         const shifts ={
             start_date: minDate, 
             end_date: maxDate,
             statuses: ['scheduled'] 
         }
         
         getShifts(shifts).then(shifts =>{
         if(shifts){
             let newShifts = [];
             this.parseShifts(shifts,newShifts,minDate,maxDate);
             if(newShifts.length !== 0)
             {
                if (this._isMounted)
                {
                    this.setState({ weeklyShifts:shifts,
                                    parsedWeeklyShifts:newShifts}, () => this.initializeTable());
                }
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
        let startDate = minDate;
        let endDate;

        while(startDate <= maxDate)
        {
            if(shifts[startDate])
            {
                for(let i=0; i<shifts[startDate].length; i++)
                {
                     if((shifts[startDate][i])["start time"]>=(shifts[startDate][i])["end time"])
                    {
                        endDate= moment(startDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD')
                        newShifts.push({start_date: startDate + " " + (shifts[startDate][i])["start_time"], end_date: startDate  + " 24:00",
                        text: (shifts[startDate][i])["job_type"] +":" +
                        (shifts[startDate][i])["employees"].map((employee) => " " + employee["first_name"] + " " + employee["last_name"]),
                        id:(shifts[startDate][i])["id"]})
                        newShifts.push({start_date: endDate + " 00:00", end_date: endDate  + " " + (shifts[startDate][i])["end_time"],
                        text: (shifts[startDate][i])["job_type"] +":" +
                        (shifts[startDate][i])["employees"].map((employee) => " " +employee["first_name"] + " " + employee["last_name"]),
                        id:(shifts[startDate][i])["id"] + " extended shift"})
                    }
                    else
                    {
                        endDate = startDate;
                        newShifts.push({start_date: startDate + " " + (shifts[startDate][i])["start_time"], end_date: endDate  + " " + (shifts[startDate][i])["end_time"],
                        text: (shifts[startDate][i])["job_type"] +":" +
                          (shifts[startDate][i])["employees"].map((employee) => " " +employee["first_name"] + " " + employee["last_name"]),
                         id:(shifts[startDate][i])["id"]})
                    }
                }
            }
            
            j++;
            startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }
    }

    initializeTable()
    {
        for(let i =0; i< this.state.parsedWeeklyShifts.length; i++)
        {
            window.scheduler.addEvent(this.state.parsedWeeklyShifts[i])
        }
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5" style={{display: 'inline-block',marginLeft: '-65%'}}>
                 <div className="col-sm-8 mx-auto">
                    <h1 className="text-center">
                        {<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-calendar-week" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                            <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                        </svg>} Shifts</h1>
                 </div>
                 <div className='scheduler-container'>
                    <Scheduler/>
                 </div>  
                </div> 
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onEditShifts(`/editPreferences`)}>
                                Edit Employee Preference
                </button>   
                <button type="button" className="btn btn-lg btn-primary btn-block"  onClick={() => this.onGenerateShifts(`/generateShifts`)}>
                                Update And Build Shifts
                </button> 
            </div>
        )
    }
}

export default withRouter(Shifts)