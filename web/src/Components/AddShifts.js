import React, { Component } from 'react'
import { ListOfEmployees } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

class AddShifts extends Component {
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
            amount:'',
            day_part:[0],
            employees_for_shift:[],
            shift_note:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount()
    {
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                this.setState({arrEmployees: employees});
            }
         });
    };

    initializeOptions = () => { 
        return this.state.arrEmployees.map((employee,index) => (
        <option key={index + 1} value= {employee["_id"]} >{employee["first name"]} {employee["last name"]}</option>
        ));
  }

    validateRegisterForm() {

    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault()

     
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm2" onSubmit={this.onSubmit}>
                        <   h1 className="h3 mb-3 font-weight-normal text-center">Add Shift</h1>
                            <div className="form-group">
                                <label htmlFor="shift_name">Name Of The Shift</label>
                                <input type="text"
                                    className="form-control"
                                    name="shift_name"
                                    placeholder="Enter The Name Of The Shift"
                                    value={this.state.shift_name}
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
                                    placeholder="Enter The Job Type For The Shift"
                                    value={this.state.job_type}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty Of The Shift</label>
                                <input type="number"
                                    min="1" 
                                    max="5"
                                    className="form-control"
                                    name="difficulty"
                                    placeholder="Enter The Difficulty Of The Shift"
                                    value={this.state.difficulty}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input type="date"
                                    className="form-control"
                                    name="date"
                                    min= {moment().day(7).format('YYYY-MM-DD')}
                                    max= {moment().day(13).format('YYYY-MM-DD')}
                                    value={this.state.date}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="day_part">Day Part </label>
                                <select 
                                className="custom-select form-control" 
                                id="inputGroupSelect03" 
                                name="day_part" 
                                onChange={this.onChange}>
                                <option value="Morning">Morning</option >
                                <option value="Afternoon">Afternoon</option >
                                <option value="Evening">Evening</option >
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount_of_employees">Amount Of Employees For The Shift</label>
                                <input type="number"
                                    min="1"
                                    className="form-control"
                                    name="amount_of_employees"
                                    placeholder="Enter The Amount Of Employees For The Shift"
                                    value={this.state.amount_of_employees}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="employees_for_shift">Employees For The Shift</label>
                                <select
                                className="custom-select form-control"
                                name="employees_for_shift" 
                                onChange={this.onChange} >
                                <option value="All">All</option>
                                {this.initializeOptions()}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shift_note">Note For The Shift</label>
                                <input type="text"
                                    className="form-control"
                                    name="shift_note"
                                    placeholder="Enter Note For The Shift (Optional)"
                                    value={this.state.shift_note}
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Add Shift
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    )
    }
}

export default withRouter(AddShifts)