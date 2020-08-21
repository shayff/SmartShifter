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
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onEditShifts(`/editShifts`)}>
                                Edit Submission Of Shifts
                </button>   
                <button type="submit" className="btn btn-lg btn-primary btn-block"  onClick={() => this.onGenerateShifts(`/generateShifts`)}>
                                Generate Shifts
                </button> 
            </div>
        )
    }
}

export default withRouter(Shifts)
 
/*
import React, { Component } from 'react'
import { getShifts } from './UserFunctions'
import Scheduler from './Scheduler'
import './Scheduler.css'
import moment from 'moment'


class Shifts extends Component {
    constructor() {
        super();
     this.state = {
        weeklyShifts : [],
        sunday:moment().day(0),
        monday:moment().day(1),
        tuesday:moment().day(2),
        wednesday:moment().day(3),
        thursday:moment().day(4),
        friday:moment().day(5),
        saturday:moment().day(6),
        thisSunday:moment().day(0),
        today:moment(),
        hours:["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00",
               "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
        };
    }

    onClickToday(){
        const currSunday = this.state.thisSunday;
        this.setState({
           sunday: currSunday,
           monday: moment(currSunday, "YYYY-MM-DD").add(1, 'days'),
           tuesday: moment(currSunday, "YYYY-MM-DD").add(2, 'days'),
           wednesday: moment(currSunday, "YYYY-MM-DD").add(3, 'days'),
           thursday: moment(currSunday, "YYYY-MM-DD").add(4, 'days'),
           friday: moment(currSunday, "YYYY-MM-DD").add(5, 'days'),
           saturday: moment(currSunday, "YYYY-MM-DD").add(6, 'days'),
        }, () => this.colorToday());
      }

     onClickNextWeek(){
      this.setState({
         sunday: moment(this.state.sunday, "YYYY-MM-DD").add(7, 'days'),
         monday: moment(this.state.monday, "YYYY-MM-DD").add(7, 'days'),
         tuesday: moment(this.state.tuesday, "YYYY-MM-DD").add(7, 'days'),
         wednesday: moment(this.state.wednesday, "YYYY-MM-DD").add(7, 'days'),
         thursday: moment(this.state.thursday, "YYYY-MM-DD").add(7, 'days'),
         friday: moment(this.state.friday, "YYYY-MM-DD").add(7, 'days'),
         saturday: moment(this.state.saturday, "YYYY-MM-DD").add(7, 'days'),
      },() => this.colorToday());
     
    }

    onClickPreviousWeek(){
         this.setState({
            sunday:moment(this.state.sunday, "YYYY-MM-DD").add(-7, 'days'),
            monday:moment(this.state.monday, "YYYY-MM-DD").add(-7, 'days'),
            tuesday:moment(this.state.tuesday, "YYYY-MM-DD").add(-7, 'days'),
            wednesday:moment(this.state.wednesday, "YYYY-MM-DD").add(-7, 'days'),
            thursday:moment(this.state.thursday, "YYYY-MM-DD").add(-7, 'days'),
            friday:moment(this.state.friday, "YYYY-MM-DD").add(-7, 'days'),
            saturday:moment(this.state.saturday, "YYYY-MM-DD").add(-7, 'days'),
         } ,() => this.colorToday());
        
    }

    onGenerateShifts(path) 
    {
        this.props.history.push(path);
    }

    onEditShifts(path)
    {
        this.props.history.push(path);
    }

    colorToday()
    {
        let day;
        let current_class = document.getElementsByClassName("shifts");
        current_class = Array.from(current_class);

        switch(this.state.today.format('YYYY-MM-DD'))
        {
           case this.state.sunday.format('YYYY-MM-DD'): day="1"; break;  
           case this.state.monday.format('YYYY-MM-DD'): day="2"; break;  
           case this.state.tuesday.format('YYYY-MM-DD'): day="3"; break;  
           case this.state.wednesday.format('YYYY-MM-DD'): day="4"; break;  
           case this.state.thursday.format('YYYY-MM-DD'): day="5"; break;  
           case this.state.friday.format('YYYY-MM-DD'): day="6"; break;  
           case this.state.saturday.format('YYYY-MM-DD'): day="7"; break;  
           default: day= "0";
        }

        current_class.map(function(shifts)
        {
          if(shifts.className.includes(day))
            {
               shifts.className = "table-secondary shifts " + day;
            }
          else
            {
              for(let i=1; i<=7; i++)
               {
                  if(shifts.className.includes(i.toString()))
                    {
                      shifts.className = "table-light shifts " + i.toString();
                    }
               }
            }
            return null     
        });
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
            <th scope="row" id={"sunday" + index} className={sunday}>{this.initializeShifts(this.state.sunday.format('YYYY-MM-DD'),hours,"sunday"+ index)}</th>
            <th scope="row" id={"monday" + index} className={monday}>{this.initializeShifts(this.state.monday.format('YYYY-MM-DD'),hours,"monday"+ index )}</th>
            <th scope="row" id={"tuesday" + index} className={tuesday}>{this.initializeShifts(this.state.tuesday.format('YYYY-MM-DD'),hours,"tuesday" + index)}</th>
            <th scope="row" id={"wednesday" + index} className={wednesday}>{this.initializeShifts(this.state.wednesday.format('YYYY-MM-DD'),hours,"wednesday" + index)}</th>
            <th scope="row" id={"thursday" + index} className={thursday}>{this.initializeShifts(this.state.thursday.format('YYYY-MM-DD'),hours,"thursday" + index)}</th>
            <th scope="row" id={"friday" + index} className={friday}>{this.initializeShifts(this.state.friday.format('YYYY-MM-DD'),hours,"friday" + index)}</th>
            <th scope="row" id={"saturday" + index} className={saturday}>{this.initializeShifts(this.state.saturday.format('YYYY-MM-DD'),hours,"saturday" + index)}</th>
            </tr>
            ));
    }

    initializeShifts(day,hour,id)
    {   
        if(this.state.weeklyShifts[day])
        {
            for(let i=0; i<this.state.weeklyShifts[day].length; i++)
            {
                if((this.state.weeklyShifts[day][i])["start time"]<= hour && (this.state.weeklyShifts[day][i])["end time"]> hour )
                {
                    return (                  
                    <div className = "badge badge-primary text-wrap" style = { { width: '100%', height: '100%'} } >
                        <p className="font-weight-bold text-center" style = { {fontSize:'18px'} } >
                          <u>{(this.state.weeklyShifts[day][i])["start time"]} - {(this.state.weeklyShifts[day][i])["end time"]} ({(this.state.weeklyShifts[day][i])["name"]})</u>
                        </p>
                        <p className="font-weight-normal text-center" style = { {fontSize:'17px'} }>
                        <u>{(this.state.weeklyShifts[day][i])["job type"]}s:</u>
                        </p>
                        <span className="font-weight-normal text-center " style = { {fontSize:'15px'} }>
                        {(this.state.weeklyShifts[day][i])["employees"].map((employee,index) => 
                            <p key={index}>
                                {employee["first name"]} {employee["last name"]}
                            </p>)}
                        </span>
                    </div>
                    )
                }
            }
        }
    }

    componentDidMount()
    {
        this.colorToday();

        const sunday = window.scheduler.getState().min_date;
        const formatFunc = window.scheduler.date.date_to_str("%Y-%m-%d");
        const sunday_date = formatFunc(sunday); 
        const saturday = window.scheduler.getState().max_date;
        const saturday_date = formatFunc(saturday); 

        const shifts ={
            start_date: sunday_date, 
            end_date: saturday_date
        }
        
        getShifts(shifts).then(shifts =>{
        if(shifts){
            let newShifts = [];
            this.parseShifts(shifts,newShifts);
            this.setState({ weeklyShifts:newShifts},() => {console.log(this.state.weeklyShifts); this.initializeTable()});
          }
        })
    };

    parseShifts(shifts,newShifts)
    {
        for(let i=0; i<=6; i++)
        {
            let date = moment().day(i).format('YYYY-MM-DD');
            if(shifts[date])
            {
                for(let i=0; i<shifts[date].length; i++)
                {
                   newShifts.push({start_date: date + " " + (shifts[date][i])["start time"], end_date: date  +" " + (shifts[date][i])["end time"],
                    text: (shifts[date][i])["job type"] +":" +
                      (shifts[date][i])["employees"].map((employee,index) => " " +employee["first name"] + " " + employee["last name"]),
                     id:(shifts[date][i])["id"]})
                }
            }
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
            <div className="container">
                <div className="jumbotron mt-5">
                 <div className="col-sm-8 mx-auto">
                    <h1 className="text-center"> Shifts </h1>
                 </div>
                 <div className='scheduler-container'>
                    <Scheduler/>
                    <table className="table table-borderless ">
                    <thead>                          
                            <tr>                    
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary">
                               Day
                            </button></th>   
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary">
                                Week
                            </button></th>                                                         
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary">
                                Month
                            </button></th>                     
                            <th scope="col"></th>                     
                            <th scope="col"></th>    
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary" onClick={() => this.onClickPreviousWeek()}>
                                Previous Week
                            </button></th>   
                            <th scope="col"><button type="button" id= "previous" className="btn btn-lg btn-primary" onClick={() => this.onClickToday()}>
                                Today
                            </button></th>                   
                            <th scope="col" ><button type="button" className="btn btn-lg btn-primary" onClick={() => this.onClickNextWeek()}>
                                Next Week
                            </button></th>                     
                            </tr>
                        </thead>
                    </table>
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
                </div> 
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onEditShifts(`/editShifts`)}>
                                Edit Submission Of Shifts
                    </button>   
                    <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onGenerateShifts(`/generateShifts`)}>
                                Generate Shifts
                    </button> 
            </div>
        )
    }
}

export default Shifts
 */