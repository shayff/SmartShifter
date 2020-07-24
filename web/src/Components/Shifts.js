import React, { Component } from 'react'
import { getShifts } from './UserFunctions'
// import Scheduler from './Scheduler'
// import './Scheduler.css'
import moment from 'moment'


class Shifts extends Component {
    constructor() {
        super();
     this.state = {
        // data: [
        //     { start_date:'2020-07-22 6:00', end_date:'2020-07-22 8:00', text:'waiter: eliran, shay', id: 1 },
        //     { start_date:'2020-07-24 10:00', end_date:'2020-07-24 18:00', text:'waiter: daniel, nely', id: 2 }
        // ],
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
               "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"]
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
            <th scope="row" className={sunday}>{this.initializeShifts(this.state.sunday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={monday}>{this.initializeShifts(this.state.monday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={tuesday}>{this.initializeShifts(this.state.tuesday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={wednesday}>{this.initializeShifts(this.state.wednesday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={thursday}>{this.initializeShifts(this.state.thursday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={friday}>{this.initializeShifts(this.state.friday.format('YYYY-MM-DD'),hours)}</th>
            <th scope="row" className={saturday}>{this.initializeShifts(this.state.saturday.format('YYYY-MM-DD'),hours)}</th>
            </tr>
            ));
    }
//
    initializeShifts(day,hour)
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
                          <u>{(this.state.weeklyShifts[day][i])["start time"]} - {(this.state.weeklyShifts[day][i])["end time"]}</u>
                        </p>
                        <p className="font-weight-normal text-left" style = { {fontSize:'17px'} }>
                        <u>{(this.state.weeklyShifts[day][i])["job type"]}s:</u>
                        </p>
                        <p className="font-weight-normal text-left " style = { {fontSize:'15px'} }>
                        {(this.state.weeklyShifts[day][i])["employees"].map((employee) => 
                            <p>
                                {employee["first name"]} {employee["last name"]}
                            </p>)}
                        </p>
                    </div>
                    )
                }
            }
        }
    }

    componentDidMount()
    {
        this.colorToday();

        const shifts ={
            start_date: this.state.sunday.format('YYYY-MM-DD'), 
            end_date: this.state.saturday.format('YYYY-MM-DD')
        }

        getShifts(shifts).then(shifts =>{
        if(shifts){
            this.setState({ weeklyShifts:shifts},() => console.log(this.state.weeklyShifts));
          }
        })
    };

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                 <div className="col-sm-8 mx-auto">
                    <h1 className="text-center"> Shifts </h1>
                 </div>
                 {/* <div className='scheduler-container'>
                    <Scheduler events={this.state.data}/> */}
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
                {/* </div>  */}
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
 