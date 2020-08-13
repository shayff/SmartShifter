import React, { Component } from 'react'
import { ListOfEmployees,acceptBuildShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class ShowGeneratedShifts extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            dataBuildShifts:{},
            arrBuildShifts:[],
            arrEmployees:[],
            sunday:moment().day(7),
            monday:moment().day(8),
            tuesday:moment().day(9),
            wednesday:moment().day(10),
            thursday:moment().day(11),
            friday:moment().day(12),
            saturday:moment().day(13),
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
        const minDate = moment().day(7).format('YYYY-MM-DD');
        const maxDate = moment().day(13).format('YYYY-MM-DD');
        const buildedShifts = this.props.location.state.detail.Full_data;
        
        if(buildedShifts)
        {
            let parserShifts = [];
            this.parseShifts(buildedShifts,parserShifts,minDate,maxDate);
            if(parserShifts.length !== 0)
            {
                if (this._isMounted)
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

//     onUpdateInfoShift(path, shift) {
//         this.props.history.push(path, { detail: shift})
//    }

   initializeTableModal(shift,index)
   {
       const modalButton = '#exampleModal' + index;
       const ModalId = "exampleModal" + index;
       const modalLabel = 'exampleModalLabel' + index;
       let shiftIsOk = "btn btn-info btn-block";
       let shiftIsNotOk = "btn btn-danger btn-block";
       
       return(
       <div key = {index} style={{padding:'5px'}}>
           <button type="button" className={shift.Is_shift_full === 'full' ? shiftIsOk : shiftIsNotOk} data-toggle="modal" data-target={modalButton}>
                {shift.Is_shift_full === 'full' ? <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-calendar2-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    <path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                    <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg> : <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-exclamation-triangle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>} <br/> {shift.name} <br/> {shift["start time"]}-{shift["end time"]}<br/>{shift.employees.map((employee,index) => (
                                                <div key = {index}>
                                                    {employee["first name"] + " " + employee["last name"]}
                                                </div>))}
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
                               <td className={shift.Is_shift_full === 'full' ? "table-primary" : "table-danger"}>Amount Of Employees</td>
                               <td className={shift.Is_shift_full === 'full' ? "table-secondary" : "table-danger"}>{shift.amount}</td>
                           </tr>
                           <tr className="text-center">
                               <td className={shift.Is_shift_full === 'full' ? "table-primary" : "table-danger"}>Employees For The Shift</td>
                               <td className={shift.Is_shift_full === 'full' ? "table-secondary" : "table-danger"}>{shift.employees.map((employee,index) => (
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
                       {/* <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.onUpdateInfoShift(`/updateShift`,shift)}>
                           Update Shift
                       </button> */}
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
                <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: this.state.success_percentage + "%"}} aria-valuenow={this.state.success_percentage + ""} aria-valuemin="0" aria-valuemax="100">
                        {this.state.success_percentage}%
                    </div>
                </div>  
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
             <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAcceptBuild(`/shifts`)}>
                        Accept Build
                </button>   
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onDeclineBuild(`/generateShifts`)}>
                      Decline Build
                </button>  
            </div>
        )
    }
}

export default withRouter(ShowGeneratedShifts)


 // initializeTableModal(shift,index)
    // {
    //     const collapseCard = '#collapseOne' + index;
    //     const collapseId = "collapseOne" + index;
    //     const collapseLabel = 'headingOne' + index;
    //     const collapseAccordion = 'accordion' + index;
    //     const collapseAccordionCard = '#accordion' + index;

 
    //     return(
    //     <div key = {index} style={{padding:'5px'}}>
    //             <div id={collapseAccordion}>
    //                 <div className="card">
    //                     <div className="card-header" id={collapseLabel}>
    //                     <h5 className="mb-0">
    //                         <button className="btn btn-link" data-toggle="collapse" data-target={collapseCard} aria-expanded="true" aria-controls={collapseId}>
    //                         {shift.name}<br/>{shift["start time"]}-{shift["end time"]}<br/>{shift.employees.map((employee) => (
    //                                     employee["first name"] + " " + employee["last name"] + ", "))}
    //                         </button>
    //                     </h5>
    //                     </div>
    //                     <div id={collapseId} className="collapse" aria-labelledby={collapseLabel} data-parent={collapseAccordionCard}>
    //                     <div className="card-body">
    //                         <table className="table table-bordered">
    //                         <tbody>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Name Of The Shift</td>
    //                                 <td className="table-secondary">{shift.name}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Date Of The Shift</td>
    //                                 <td className="table-secondary">{shift.date}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Start Time Of The Shift</td>
    //                                 <td className="table-secondary">{shift["start time"]}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">End Time Of The Shift</td>
    //                                 <td className="table-secondary">{shift["end time"]}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Job Type For The Shift</td>
    //                                 <td className="table-secondary">{shift["job type"]}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Difficulty Of The Shift</td>
    //                                 <td className="table-secondary">{shift.difficulty}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Day Part Of The Shift</td>
    //                                 <td className="table-secondary">{this.ParseDayParts(shift["day part"])}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Amount Of Employees</td>
    //                                 <td className="table-secondary">{shift.amount}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Employees For The Shift</td>
    //                                 <td className="table-secondary">{shift.employees.map((employee) => (
    //                                     employee["first name"] + " " + employee["last name"] + ", "))}</td>
    //                             </tr>
    //                             <tr className="text-center">
    //                                 <td className="table-primary">Note For The Shift</td>
    //                                 <td className="table-secondary">{shift.note}</td>
    //                             </tr>
    //                         </tbody>
    //                         </table>
    //                     </div>
    //                     </div>
    //                 </div>
    //             </div>
    //     </div>)
    // }