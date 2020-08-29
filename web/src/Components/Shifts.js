import React, { Component } from 'react'
import { getShifts } from './UserFunctions'
import Scheduler from './Scheduler'
import './Scheduler.css'
import moment from 'moment'
import { withRouter } from 'react-router-dom'


class Shifts extends Component {
    _isMounted = false;

    constructor() {
        super();
     this.state = {
        weeklyShifts : [],
        };
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount()
    {
        this._isMounted = true;

        window.scheduler.attachEvent("onViewChange", function (new_mode , new_date){this.updateDatesAndGetShifts()}.bind(this));
        this.updateDatesAndGetShifts();
    };

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
                    this.setState({ weeklyShifts:newShifts},() => this.initializeTable());
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
                        newShifts.push({start_date: startDate + " " + (shifts[startDate][i])["start time"], end_date: startDate  + " 24:00",
                        text: (shifts[startDate][i])["job type"] +":" +
                        (shifts[startDate][i])["employees"].map((employee) => " " + employee["first name"] + " " + employee["last name"]),
                        id:(shifts[startDate][i])["id"]})
                        newShifts.push({start_date: endDate + " 00:00", end_date: endDate  + " " + (shifts[startDate][i])["end time"],
                        text: (shifts[startDate][i])["job type"] +":" +
                        (shifts[startDate][i])["employees"].map((employee) => " " +employee["first name"] + " " + employee["last name"]),
                        id:(shifts[startDate][i])["id"] + " extended shift"})
                    }
                    else
                    {
                        endDate = startDate;
                        newShifts.push({start_date: startDate + " " + (shifts[startDate][i])["start time"], end_date: endDate  + " " + (shifts[startDate][i])["end time"],
                        text: (shifts[startDate][i])["job type"] +":" +
                          (shifts[startDate][i])["employees"].map((employee) => " " +employee["first name"] + " " + employee["last name"]),
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
        for(let i =0; i< this.state.weeklyShifts.length; i++)
        {
            window.scheduler.addEvent(this.state.weeklyShifts[i])
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
                <button type="button" className="btn btn-lg btn-primary btn-block"  onClick={() => this.onEditShifts(`/`)}>
                                Update Current Week Shifts
                </button>  
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={() => this.onEditShifts(`/editPreferences`)}>
                                Edit Employee Preference
                </button>   
                <button type="button" className="btn btn-lg btn-primary btn-block"  onClick={() => this.onGenerateShifts(`/generateShifts`)}>
                                Generate Shifts
                </button> 
            </div>
        )
    }
}

export default withRouter(Shifts)