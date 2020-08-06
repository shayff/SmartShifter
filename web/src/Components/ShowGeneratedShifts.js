import React, { Component } from 'react'
import { ListOfEmployees,removeShift,acceptBuildShift } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class ShowGeneratedShifts extends Component {
    constructor() {
        super()
        this.state = {
            arrBuildShifts:[],
            arrEmployees:[],
            sunday:moment().day(7),
            monday:moment().day(8),
            tuesday:moment().day(9),
            wednesday:moment().day(10),
            thursday:moment().day(11),
            friday:moment().day(12),
            saturday:moment().day(13)
        }
    }
     
    componentDidMount()
    {
        const minDate = moment().day(7).format('YYYY-MM-DD');
        const maxDate = moment().day(13).format('YYYY-MM-DD');
        const buildedShifts = this.props.location.state.detail;

        if(buildedShifts)
        {
            let parserShifts = [];
            this.parseShifts(buildedShifts,parserShifts,minDate,maxDate);
            if(parserShifts.length !== 0)
            {
              this.setState({ arrBuildShifts: parserShifts},()=> console.log(this.state.arrBuildShifts));
            }
            else
            {
                alert("No Shifts To Show")
            }
        }
        
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                this.setState({arrEmployees: employees});
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

    onDeclineBuild(path)
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
        const collapseCard = '#collapseOne' + index;
        const collapseId = "collapseOne" + index;
        const collapseLabel = 'headingOne' + index;
        const collapseAccordion = 'accordion' + index;
        const collapseAccordionCard = '#accordion' + index;

 
        return(
        <div key = {index} style={{padding:'5px'}}>
                <div id={collapseAccordion}>
                    <div className="card">
                        <div className="card-header" id={collapseLabel}>
                        <h5 className="mb-0">
                            <button className="btn btn-link" data-toggle="collapse" data-target={collapseCard} aria-expanded="true" aria-controls={collapseId}>
                            {shift.name}<br/>{shift["start time"]}-{shift["end time"]}<br/>{shift.employees.map((employee) => (
                                        employee["first name"] + " " + employee["last name"] + ", "))}
                            </button>
                        </h5>
                        </div>
                        <div id={collapseId} className="collapse" aria-labelledby={collapseLabel} data-parent={collapseAccordionCard}>
                        <div className="card-body">
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
        acceptBuildShift().then(res => {
            if(res)
            {
                this.props.history.push(path)
            }
        })
    }

    render () {
        return (
            <div className="container">
            <div className="jumbotron mt-5">
             <div className="col-sm-8 mx-auto">
                <h1 className="text-center"> Generated Shifts </h1>
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
             <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAcceptBuild(`/generateShifts`)}>
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
