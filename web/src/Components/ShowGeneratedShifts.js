import React, { Component } from 'react'
import { acceptBuildShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class ShowGeneratedShifts extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            dataBuildShifts:{},
            arrBuildShifts:[],
            sunday:moment().day(0),
            monday:moment().day(1),
            tuesday:moment().day(2),
            wednesday:moment().day(3),
            thursday:moment().day(4),
            friday:moment().day(5),
            saturday:moment().day(6),
            success_percentage:0
        }
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount()
    {
        this._isMounted = true;
        const currentWeek = this.props.location.state.currentWeek;

        if(this._isMounted)
        {
            if(currentWeek)
            {
                this.initializeShifts();
            }
            else
            {
                this.setState({ sunday:moment().day(7),
                                monday:moment().day(8),
                                tuesday:moment().day(9),
                                wednesday:moment().day(10),
                                thursday:moment().day(11),
                                friday:moment().day(12),
                                saturday:moment().day(13)},() => this.initializeShifts());
            }
        }
    };

    initializeShifts()
    {
        const buildedShifts = this.props.location.state.detail.full_data;
        const minDate = this.state.sunday.format('YYYY-MM-DD');
        const maxDate = this.state.saturday.format('YYYY-MM-DD');

        if(buildedShifts)
        {
            let parserShifts = [];
            this.parseShifts(buildedShifts,parserShifts,minDate,maxDate);
            if(parserShifts.length !== 0)
            {
                if(this._isMounted)
                {
                    this.setState({ arrBuildShifts: parserShifts,
                                    dataBuildShifts: this.props.location.state.detail.data,
                                    success_percentage: this.props.location.state.detail.success_rate});
                }
            }
            else
            {
                alert("The Algorithm Could Not Build The Requested Shifts ")
            }
        }
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

    onDeclineBuild(path)
    {
        this.props.history.push(path);
    }

    onUpdateInfoShift(path, shift) 
    {
        this.props.history.push(path, { detail:shift, inBuild:true, oldDetail:this.props.location.state.detail})
    }

   initializeTableModal(shift,index)
   {
       const modalButton = '#exampleModal' + index;
       const ModalId = "exampleModal" + index;
       const modalLabel = 'exampleModalLabel' + index;
       const shiftIsOk = "btn btn-success btn-block";
       const shiftIsNotOk = "btn btn-danger btn-block";
       
       return(
       <div key = {index} style={{padding:'5px'}}>
           <button type="button" className={shift.is_shift_full === 'full' ? shiftIsOk : shiftIsNotOk} data-toggle="modal" data-target={modalButton}>
                {shift.is_shift_full === 'full' ? <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-calendar2-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                    <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg> : <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-exclamation-triangle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>} <br/> {shift.name} <br/> {shift["start_time"]} - {shift["end_time"]}<br/>{shift.employees.map((employee,index) => (
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
                               <td className="table-secondary">{shift["start_time"]}</td>
                           </tr>
                           <tr className="text-center">
                               <td className="table-primary">End Time Of The Shift</td>
                               <td className="table-secondary">{shift["end_time"]}</td>
                           </tr>
                           <tr className="text-center">
                               <td className="table-primary">Job Type For The Shift</td>
                               <td className="table-secondary">{shift["job_type"]}</td>
                           </tr>
                           <tr className="text-center">
                               <td className="table-primary">Difficulty Of The Shift</td>
                               <td className="table-secondary">{shift.difficulty}</td>
                           </tr>
                           <tr className="text-center">
                               <td className="table-primary">Day Part Of The Shift</td>
                               <td className="table-secondary">{this.ParseDayParts(shift["day_part"])}</td>
                           </tr>
                           <tr className="text-center">
                               <td className={shift.is_shift_full === 'full' ? "table-primary" : "table-danger"}>Amount Of Employees</td>
                               <td className={shift.is_shift_full === 'full' ? "table-secondary" : "table-danger"}>{shift.amount}</td>
                           </tr>
                           <tr className="text-center">
                               <td className={shift.is_shift_full === 'full' ? "table-primary" : "table-danger"}>Employees For The Shift</td>
                               <td className={shift.is_shift_full === 'full' ? "table-secondary" : "table-danger"}>{shift.employees.map((employee,index) => (
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
                       <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.onUpdateInfoShift(`/updateShift`,shift)}>
                           Update Shift
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
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.sunday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.monday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.tuesday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.wednesday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.thursday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.friday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
                <td>
                {this.state.arrBuildShifts.map((shift,index) => (
                    shift.date === this.state.saturday.format('YYYY-MM-DD') ? this.initializeTableModal(shift,index):null
                ))}
                </td>
            </tr>
            );
    }

    onAcceptBuild (path) 
    {
        acceptBuildShift(this.state.dataBuildShifts).then(res => {
            if(res.ok)
            {
                this.props.history.push(path)
            }
        })
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
            <div className="jumbotron mt-5" style={{display: 'inline-block' , marginLeft: '-10%'}}>
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Generated Shifts </h1>
             </div>
             <div style={{paddingBottom:'8px'}}>
                <label htmlFor="success_percentage">Success Percentage Of The Algorithm</label>
                <div className="progress" style={{backgroundColor:'#aaa',height: '20px',fontSize:'15px'}}>
                    <div className="progress-bar" role="progressbar" style={{width: this.state.success_percentage + "%"}} aria-valuenow={this.state.success_percentage + ""} aria-valuemin="0" aria-valuemax="100">
                        {this.state.success_percentage}%
                    </div>
                </div>  
             </div>
                <table className="table table-bordered" style={{marginBottom: '30px'}}>
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
                 <div style={{backgroundColor:'#dc3545',height:"30px",width:"40px",float:'left'}}></div>
                 <label style={{marginLeft:"10px", marginBottom: '30px'}}>A Shift That Has Been Set And Is Not Good</label><br/>
                 <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAcceptBuild(`/shifts`)}>
                        Accept Build
                </button>   
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onDeclineBuild(`/generateShifts`)}>
                        Decline Build
                </button>  
             </div>
            </div>
        )
    }
}

export default withRouter(ShowGeneratedShifts)