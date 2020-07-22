import React, { Component } from 'react'
import { getShifts } from './UserFunctions'
// import Scheduler from './Scheduler'
// import './Scheduler.css'
import moment from 'moment'


class Shifts extends Component {
    constructor() {
        super();
     this.state = {
        data : [],
        sunday:moment().day(0),
        monday:moment().day(1),
        tuesday:moment().day(2),
        wednesday:moment().day(3),
        thursday:moment().day(4),
        friday:moment().day(5),
        saturday:moment().day(6),
        thisSunday:moment().day(0),
        today:moment()
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

    componentDidMount()
    {
        this.colorToday()
        const shifts ={
            start_date: "2020-04-22", 
            end_date: "2020-04-24"
        }
        getShifts(shifts).then(shifts =>{
        console.log(shifts);
        if(shifts){
            console.log(shifts);
         this.setState({
            StartTime:shifts["start_date"],
            EndTime:shifts["end_date"]});
             }
        })
    };

    render () {
        const sunday= "table-light shifts 1";
        const monday= "table-light shifts 2";
        const tuesday= "table-light shifts 3";
        const wednesday= "table-light shifts 4";
        const thursday= "table-light shifts 5";
        const friday= "table-light shifts 6";
        const saturday= "table-light shifts 7";

        const hours= "table-info";
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
                            <tr>
                            <th scope="row" id="Sunday"className={hours}>00:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>01:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>02:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>03:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>04:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>05:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>06:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>07:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>08:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>09:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>10:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>11:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>12:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>13:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>14:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>15:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>16:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>17:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>18:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>19:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>20:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>21:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>22:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>23:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                            <tr>
                            <th scope="row" className={hours}>24:00</th>
                            <th scope="row" className={sunday}></th>
                            <th scope="row" className={monday}></th>
                            <th scope="row" className={tuesday}></th>
                            <th scope="row" className={wednesday}></th>
                            <th scope="row" className={thursday}></th>
                            <th scope="row" className={friday}></th>
                            <th scope="row" className={saturday}></th>
                            </tr>
                        </tbody>
                        </table>
                 {/* </div>  */}
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
 