import React, { Component } from 'react'
import { ListOfEmployees, updateShift } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'
import moment from 'moment'

class UpdateShift extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            arrEmployees:[],
            shift_name:'',
            start_time:'',
            end_time:'',
            job_type:'',
            difficulty:'',
            date:'',
            amount_of_employees:'',
            day_part:[],
            employees_for_shift:[],
            shift_note:'',
            shift_id:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSelectEmployees = this.onSelectEmployees.bind(this)
        this.onRemoveEmployees = this.onRemoveEmployees.bind(this)
        this.onSelectDayPart = this.onSelectDayPart.bind(this)
        this.onRemoveDayPart = this.onRemoveDayPart.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSelectEmployees(selectedList, selectedItem) {
        this.setState({employees_for_shift: selectedList});
    }

    onRemoveEmployees(selectedList, selectedItem) {
        this.setState({employees_for_shift: selectedList});
    }

    onSelectDayPart(selectedList, selectedItem) {
        this.setState({day_part: selectedList});
    }

    onRemoveDayPart(selectedList, selectedItem) {
        this.setState({day_part: selectedList});
    }

    ParseDayParts(dayParts)
    {
        let dayPartsString = [];
        for(let i=0; i<dayParts.length; i++)
        {
            if(dayParts[i] === 0)
            {
                dayPartsString.push({key:0, value: "Morning"})
            }
            else if(dayParts[i] === 1)
            {
                dayPartsString.push({key:1, value: "Afternoon"})
            }
            else
            {
                dayPartsString.push({key:2, value: "Evening"})
            }
        }

        return dayPartsString;
    }

    ParseEmployeesForShift = (arrEmployees) => { 
        return arrEmployees.map((employee) => (
        {key:employee["_id"] ,value: employee["first name"] + ' ' + employee["last name"]}
        ));
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount()
    {
        this._isMounted = true;
        const shift = this.props.location.state.detail;
        const dayParts = this.ParseDayParts(shift["day part"]);
        const employeesForShift = this.ParseEmployeesForShift(shift.employees);
        
        if (this._isMounted)
        {
            this.setState({
                shift_name:shift.name,
                start_time:shift["start time"],
                end_time:shift["end time"],
                job_type:shift["job type"],
                difficulty:shift.difficulty,
                date:shift.date,
                amount_of_employees:shift.amount,
                day_part: dayParts,
                employees_for_shift: employeesForShift,
                shift_note:shift.note,
                shift_id:shift.id
            });
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

    initializeEmployeesOptions = () => { 
        return this.state.arrEmployees.map((employee,index) => (
        {key:employee["_id"] ,value: employee["first name"] + ' ' + employee["last name"] ,cat: employee["job type"]}
        ));
  }

    validateRegisterForm() {
        const shift_name = document.forms["myForm14"]["shift_name"].value;
        const start_time = document.forms["myForm14"]["start_time"].value;
        const end_time = document.forms["myForm14"]["end_time"].value;
        const job_type = document.forms["myForm14"]["job_type"].value;
        const difficulty = document.forms["myForm14"]["difficulty"].value;
        const date = document.forms["myForm14"]["date"].value;
        const amount_of_employees = document.forms["myForm14"]["amount_of_employees"].value;
        const day_part = this.state.day_part.length;
        let validate = true;
        
        if (shift_name === "" || start_time === "" || end_time === ""|| job_type === ""||
        difficulty === ""|| date === "" ||amount_of_employees === "" || day_part === 0)
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
    }

    onSubmit (e) {
        e.preventDefault()

        let employees=[];
        let dayParts=[];
        for(let i=0; i<this.state.employees_for_shift.length; i++)
        {
            employees.push(this.state.employees_for_shift[i].key)
        }
        for(let i=0; i<this.state.day_part.length; i++)
        {
            dayParts.push(this.state.day_part[i].key)
        }

        const newShift = {
            id: this.state.shift_id,
            shift_name: this.state.shift_name,
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            job_type: this.state.job_type,
            difficulty: parseInt(this.state.difficulty),
            date: this.state.date,
            amount_of_employees: parseInt(this.state.amount_of_employees),
            day_part: dayParts,
            employees_for_shift: employees,
            shift_note: this.state.shift_note,
        }

        console.log(newShift)
         if(this.validateRegisterForm()) {
            updateShift(newShift).then(res => {
            this.props.history.push(`/generateShifts`)
        })}
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm14" onSubmit={this.onSubmit}>
                        <   h1 className="h3 mb-3 font-weight-normal text-center">Update Shift</h1>
                            <div className="form-group">
                                <label htmlFor="shift_name">Name Of The Shift</label>
                                <input type="text"
                                    className="form-control"
                                    name="shift_name"
                                    placeholder="Update The Name Of The Shift"
                                    value={this.state.shift_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input type="date"
                                    className="form-control"
                                    name="date"
                                    value={this.state.date}
                                    min= {moment().day(7).format('YYYY-MM-DD')}
                                    max= {moment().day(13).format('YYYY-MM-DD')}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="start_time">Start Time Of The Shift</label>
                                <input type="time"
                                    className="form-control"
                                    name="start_time"
                                    value={this.state.start_time}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end_time">End Time Of The Shift</label>
                                <input type="time"
                                    className="form-control"
                                    name="end_time"
                                    value={this.state.end_time}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="job_type">Job Type For The Shift</label>
                                <input type="text"
                                    className="form-control"
                                    name="job_type"
                                    value={this.state.job_type}
                                    placeholder="Update The Job Type For The Shift"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty Of The Shift</label>
                                <input type="number"
                                    min="1" 
                                    max="5"
                                    className="form-control"
                                    name="difficulty"
                                    value={this.state.difficulty}
                                    placeholder="Update The Difficulty Of The Shift"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="day_part">Day Part</label>
                                <Multiselect
                                options= {[
                                    {key:0, value: "Morning" },
                                    {key:1, value: "Afternoon" },
                                    {key:2, value: "Evening"}]}
                                displayValue="value"
                                closeIcon="cancel"
                                placeholder="Update The Day Part"
                                avoidHighlightFirstOption= {true}
                                closeOnSelect={false}
                                hidePlaceholder={true}
                                selectedValues={this.state.day_part}
                                onSelect={this.onSelectDayPart}
                                onRemove={this.onRemoveDayPart}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount_of_employees">Amount Of Employees For The Shift</label>
                                <input type="number"
                                    min="1"
                                    max={this.state.arrEmployees.length}
                                    className="form-control"
                                    name="amount_of_employees"
                                    value={this.state.amount_of_employees}
                                    placeholder="Update The Amount Of Employees For The Shift"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="employees_for_shift">Employees For The Shift (Optional)</label>
                                <Multiselect
                                options= {this.initializeEmployeesOptions()}
                                displayValue="value"
                                closeIcon="cancel"
                                placeholder="Update The Employees"
                                avoidHighlightFirstOption= {true}
                                hidePlaceholder={true}
                                closeOnSelect={false}
                                groupBy="cat"
                                selectedValues={this.state.employees_for_shift}
                                onSelect={this.onSelectEmployees}
                                onRemove={this.onRemoveEmployees}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shift_note">Note For The Shift (Optional)</label>
                                <input type="text"
                                    className="form-control"
                                    name="shift_note"
                                    value={this.state.shift_note}
                                    placeholder="Update The Note For The Shift"
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Update Shift
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    )
    }
}

export default withRouter(UpdateShift)