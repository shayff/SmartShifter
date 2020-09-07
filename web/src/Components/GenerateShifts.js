import React, { Component } from 'react'
import { buildShifts,getShifts,removeShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class GenerateShifts extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            arrShiftsNotScheduled: [],
            sunday: moment().day(7),
            monday: moment().day(8),
            tuesday: moment().day(9),
            wednesday: moment().day(10),
            thursday: moment().day(11),
            friday: moment().day(12),
            saturday: moment().day(13),
            isCurrentWeek: false,
            nextDisabled: true,
            previousDisabled: false
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
    };

    updateDatesAndGetShifts()
    {
        const minDate = this.state.sunday.format('YYYY-MM-DD');
        const maxDate = this.state.saturday.format('YYYY-MM-DD');
  
         const shifts ={
             start_date: minDate, 
             end_date: maxDate,
             statuses: ['not_scheduled', 'scheduled'] 
         }
         
         getShifts(shifts).then(shifts =>{
            if(shifts){
                let parserShifts = [];
                this.parseShifts(shifts,parserShifts,minDate,maxDate);
                if(parserShifts.length === 0)
                {
                    alert("No Shifts To Show")
                }
                if (this._isMounted)
                {
                    this.setState({ arrShiftsNotScheduled:parserShifts});
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

    onRemoveAll()
    {
        let arrID = [];
        this.state.arrShiftsNotScheduled.map((shift) => (
            arrID.push(shift.id)));

        removeShift(arrID).then(()=> {
            this.updateDatesAndGetShifts();
       });
    }

    onAddShifts(path)
    {
        this.props.history.push(path);
    }

    onRemoveShift(id)
    {
        removeShift([id]).then(()=> {
            this.updateDatesAndGetShifts();
       });
    }

    onUpdateInfoShift(path, shift) {
        this.props.history.push(path, { detail: shift ,inBuild: false})
   }

    initializeTableModal(shift,index)
    {
        const modalButton = '#exampleModal' + index;
        const ModalId = "exampleModal" + index;
        const modalLabel = 'exampleModalLabel' + index;
        const shiftIsScheduled= "btn btn-success btn-block";
        const shiftIsNotScheduled= "btn btn-info btn-block";
        const shiftIsScheduledButNotOk= "btn btn-warning btn-block";

        return(
        <div key = {index} style={{padding:'5px'}}>
            <button type="button" className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? shiftIsScheduled : shiftIsScheduledButNotOk) : shiftIsNotScheduled} data-toggle="modal" data-target={modalButton}>
                {shift.name} <br/> {shift["start_time"]} - {shift["end_time"]} <br/> {shift.employees.map((employee,index) => (
                    <div key = {index}>
                        {employee["first_name"] + " " + employee["last_name"]}
                    </div>))}
           </button>
            <div className="modal fade" data-backdrop="false" id={ModalId} tabIndex="-1" aria-labelledby={modalLabel} aria-hidden="true">
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
                                <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-primary" : "table-danger") : "table-primary"}>Amount Of Employees</td>
                                <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-secondary" : "table-danger") : "table-secondary"}>{shift.amount}</td>
                            </tr>
                            <tr className="text-center">
                                <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-primary" : "table-danger") : "table-primary"}>Employees For The Shift</td>
                                <td className={shift.status === 'scheduled' ? (shift.is_shift_full === 'full' ? "table-secondary" : "table-danger") : "table-secondary"}>{shift.employees.map((employee,index) => (
                                    <div key = {index}>
                                      {employee["first_name"] + " " + employee["last_name"]}
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
                    <button type="button" style ={{visibility: shift.status === 'scheduled' ? 'visible': 'hidden'}} className="btn btn-primary" data-dismiss="modal" onClick={() => this.onSendMessage('/messages',shift)}>
                            Send Message
                        </button>
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

    onSendMessage(path, shift)
    {
        this.props.history.push(path, { detail: shift, from: "GenerateShifts"})
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

    onClickNextWeek()
    {
        if(this.state.isCurrentWeek)
        {
            this.setState({
                sunday: moment(this.state.sunday, "YYYY-MM-DD").add(7, 'days'),
                monday: moment(this.state.monday, "YYYY-MM-DD").add(7, 'days'),
                tuesday: moment(this.state.tuesday, "YYYY-MM-DD").add(7, 'days'),
                wednesday: moment(this.state.wednesday, "YYYY-MM-DD").add(7, 'days'),
                thursday: moment(this.state.thursday, "YYYY-MM-DD").add(7, 'days'),
                friday: moment(this.state.friday, "YYYY-MM-DD").add(7, 'days'),
                saturday: moment(this.state.saturday, "YYYY-MM-DD").add(7, 'days'),
                nextDisabled: true,
                previousDisabled: false,
                isCurrentWeek: false
            },() =>  this.updateDatesAndGetShifts());
        }
    }

    onClickPreviousWeek(){
       if(!this.state.isCurrentWeek)
        {
            this.setState({
                sunday:moment(this.state.sunday, "YYYY-MM-DD").add(-7, 'days'),
                monday:moment(this.state.monday, "YYYY-MM-DD").add(-7, 'days'),
                tuesday:moment(this.state.tuesday, "YYYY-MM-DD").add(-7, 'days'),
                wednesday:moment(this.state.wednesday, "YYYY-MM-DD").add(-7, 'days'),
                thursday:moment(this.state.thursday, "YYYY-MM-DD").add(-7, 'days'),
                friday:moment(this.state.friday, "YYYY-MM-DD").add(-7, 'days'),
                saturday:moment(this.state.saturday, "YYYY-MM-DD").add(-7, 'days'),
                nextDisabled: false,
                previousDisabled: true,
                isCurrentWeek: true
            },() =>  this.updateDatesAndGetShifts());
        }
    }

    onSubmit (e) {
        e.preventDefault()
        
        const dates =
        {
            startDate: this.state.sunday.format('YYYY-MM-DD'),
            endDate: this.state.saturday.format('YYYY-MM-DD')
        }

        buildShifts(dates).then(buildedShifts => {
            if(buildedShifts.data)
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
            <div className="jumbotron mt-5" style={{display: 'inline-block', marginLeft: '-10%'}}>
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Update And Build Shifts </h1>
             </div>
                <table className="table table-borderless">
                    <thead>                          
                        <tr>    
                        <th scope="col">
                            <button type="button" id= "previous" className="btn btn-lg btn-primary btn-block" disabled={this.state.previousDisabled} onClick={() => this.onClickPreviousWeek()}>
                                Previous Week
                            </button>
                        </th>                     
                        <th scope="col"></th>                     
                        <th scope="col"></th>                     
                        <th scope="col"></th>                     
                        <th scope="col"></th>                     
                        <th scope="col"></th>                     
                        <th scope="col" >
                            <button type="button" className="btn btn-lg btn-primary btn-block"  disabled={this.state.nextDisabled} onClick={() => this.onClickNextWeek()}>
                                Next Week
                            </button>
                        </th>                     
                        </tr>
                    </thead>
                </table>
                <table className="table table-bordered" >
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
                 <div style={{backgroundColor:'#28a745',height:"30px",width:"40px",float:'left'}}></div>
                 <label style={{marginLeft:"10px"}}>A Shift That Has Been Set And Is Good </label><br/>
                 <div style={{backgroundColor:'#FFC107',height:"30px",width:"40px",float:'left'}}></div>
                 <label style={{marginLeft:"10px"}}>A Shift That Has Been Set And Is Not Good</label><br/>
                 <div style={{backgroundColor:'#17A2B8',height:"30px",width:"40px",float:'left'}}></div>
                 <label style={{marginLeft:"10px", marginBottom: '30px'}}>A Shift That Has Not Yet Been Set</label>
                 <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAddShifts(`/addShifts`)}>
                    {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-calendar2-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z"/>
                        <path fillRule="evenodd" d="M7.5 10.5A.5.5 0 0 1 8 10h2a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0v-2z"/>
                        <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                        <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>}<br/> Add Shifts 
                </button> 
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onRemoveAll()}>
                               Remove All Displayed Shifts
                </button>    
                <button type="submit" className="btn btn-lg btn-primary btn-block">
                               Build Shifts
                </button>  
             </div>  
                </form>
            </div>
        )
    }
}

export default withRouter(GenerateShifts)