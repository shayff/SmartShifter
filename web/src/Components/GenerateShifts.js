import React, { Component } from 'react'
import { buildShifts, ListOfEmployees,getShifts,removeShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class GenerateShifts extends Component {
    _isMounted = false;

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

    componentWillUnmount() 
    {
        this._isMounted = false;
    }
     
    componentDidMount()
    {
        this._isMounted = true;

        this.updateDatesAndGetShifts();
        
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                if (this._isMounted)
                {
                    this.setState({arrEmployees: employees});
                }
            }
         });
    };

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
                let parserShifts = [];
                this.parseShifts(shifts,parserShifts,minDate,maxDate);
                if(parserShifts.length !== 0)
                {
                    if (this._isMounted)
                    {
                        this.setState({ arrShiftsNotScheduled:parserShifts});
                    }
                }
                else
                {
                   alert("No Shifts To Show")
                }
              }
            })
    }

    parseShifts(shifts,parserShifts,minDate,maxDate)
    {
        let j = 0;
        let date = minDate;
  
        while(date <= maxDate)
        {
            if(shifts[date])
            {
                for(let i=0; i<shifts[date].length; i++)
                {
                    parserShifts.push(shifts[date][i])
                }
            }
            j++;
            date = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }
    }

    ParseDayParts(dayParts)
    {
        let dayPartsString = '';
        for(let i=0; i<dayParts.length; i++)
        {
            if(dayParts[i] === 0)
            {
                dayPartsString+='Morning \n'
            }
            else if(dayParts[i] === 1)
            {
                dayPartsString+='Afternoon \n'
            }
            else
            {
                dayPartsString+='Evening \n'
            }
        }

        return dayPartsString = dayPartsString.split('\n').map((item, i) => {
            return <p key={i}>{item}</p>;
        });
    }

    onAddShifts(path)
    {
        this.props.history.push(path);
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
                    {shift.name}<br/>{shift["start time"]}-{shift["end time"]}
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
                                <td className="table-secondary">{shift.employees.map((employee,index) => (
                                    <div key = {index}>
                                      {employee["first name"] + " " + employee["last name"]}
                                    </div>))}
                                </td>
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
       return (
            <tr>
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

    onSubmit (e) {
        e.preventDefault()
        
        const dates =
        {
            startDate: this.state.sunday.format('YYYY-MM-DD'),
            endDate: this.state.saturday.format('YYYY-MM-DD')
        }

        buildShifts(dates).then(buildedShifts => {
            if(buildedShifts.success_rate !== 0)
            {
                this.props.history.push(`/showGeneratedShifts`, { detail: buildedShifts})
            }
            else
            {
                alert("The Algorithm Could Not Build The Requested Shifts ")
            }
        })
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
            <form name="myForm15" onSubmit={this.onSubmit}>
            <div className="jumbotron mt-5" style={{display: 'inline-block'}}>
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Build Shifts </h1>
             </div>
                <table className="table table-bordered">
                    <thead className="thead-dark">                          
                        <tr className="text-center">    
                        <th scope="col"> {this.state.sunday.format('YYYY-MM-DD')}<br/> Sunday</th>
                        <th scope="col"> {this.state.monday.format('YYYY-MM-DD')}<br/> Monday</th>
                        <th scope="col"> {this.state.tuesday.format('YYYY-MM-DD')}<br/> Tuesday</th>
                        <th scope="col"> {this.state.wednesday.format('YYYY-MM-DD')}<br/> Wednesday</th>
                        <th scope="col"> {this.state.thursday.format('YYYY-MM-DD')}<br/> Thursday</th>
                        <th scope="col"> {this.state.friday.format('YYYY-MM-DD')}<br/> Friday</th>
                        <th scope="col"> {this.state.saturday.format('YYYY-MM-DD')}<br/> Saturday</th>                      
                        </tr>
                    </thead>
                    <tbody>
                    {this.initializeTable()}
                    </tbody>
                 </table>
             </div>  
             <button type="button" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '5%'}} onClick={() => this.onAddShifts(`/addShifts`)}>
                    {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-calendar2-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z"/>
                        <path fillRule="evenodd" d="M7.5 10.5A.5.5 0 0 1 8 10h2a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0v-2z"/>
                        <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                        <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>}<br/> Add Shifts 
                </button>   
                <button type="submit" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '5%'}}>
                               Build Shifts
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