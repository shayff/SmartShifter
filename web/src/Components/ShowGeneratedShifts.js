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
                {shift.name}<br/>{shift["start time"]}-{shift["end time"]}<br/>{shift.employees.map((employee,index) => (
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