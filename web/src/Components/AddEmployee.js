import React, { Component } from 'react'
import { addEmployee } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

class AddEmployee extends Component {
    constructor() {
        super()
        this.state = {
            // first_name: '',
            // last_name: '',
            // gender:'',
            email: '',
            // password: '',
            // id_number: '',
            // phone: '',
            // address: '',
            // date_of_birth: '',
            time_of_joining:'',
            rank:'',
            job_type:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateRegisterForm() {
        // const first_name = document.forms["myForm3"]["first_name"].value;
        // const last_name = document.forms["myForm3"]["last_name"].value;
        const email = document.forms["myForm3"]["email"].value;
        // const passwrod = document.forms["myForm3"]["password"].value;
        // const id_number = document.forms["myForm3"]["id_number"].value;
        // const phone = document.forms["myForm3"]["phone"].value;
        // const address = document.forms["myForm3"]["address"].value;
        // const date_of_birth = document.forms["myForm3"]["date_of_birth"].value;
        const job_type = document.forms["myForm3"]["job_type"].value;
        const rank = document.forms["myForm3"]["rank"].value; 
    //    const gender = document.forms["myForm3"]["gender"].value;
        let validate = true;

        if (email === "" || job_type === "" || rank === "" /*|| passwrod === "" || first_name === "" || 
            id_number === ""|| last_name === ""|| phone === "" ||address === "" || date_of_birth === ""||
            gender === ""*/)
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
      }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault()

        const user = {
            // first_name: this.state.first_name,
            // last_name: this.state.last_name,
            email: this.state.email,
            // password: this.state.password,
            // id_number: this.state.id_number,
            // phone: this.state.phone,
            // address: this.state.address,
            // date_of_birth: this.state.date_of_birth,
            job_type: this.state.job_type,
            rank: this.state.rank,
            time_of_joining: moment().format(),
     //       gender: this.state.gender
        }

        if(this.validateRegisterForm()) {
        addEmployee(user).then(res => {
            this.props.history.push(`/employees`)
        })
    }
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm3" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Add Employee</h1>
                            {/* <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gedner">Gedner</label>
                                <input type="radio"
                                    placeholder="Female"
                                    name="gender"
                                    onChange={this.onChange} />
                                  Female
                                 <input type="radio"
                                    value="Male"
                                    name="gender"
                                    onChange={this.onChange} />
                                   Male
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_number">Id Number</label>
                                <input type="text"
                                    pattern="[0-9]*"
                                    minLength="9"
                                    maxLength="9"
                                    className="form-control"
                                    name="id_number"
                                    placeholder="Enter Id Number"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date Of Birth</label>
                                <input type="date"
                                    className="form-control"
                                    name="date_of_birth"
                                    placeholder="Enter Date Of Birth"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input type="text"
                                    pattern="[0-9]*"
                                    maxLength="10"
                                    className="form-control"
                                    name="phone"
                                    placeholder="Enter Phone"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Enter Address"
                                    onChange={this.onChange} />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Email"
                                    onChange={this.onChange} />
                            </div>
                            {/* <div className="form-group">
                                <label htmlFor="password">Password </label>
                                <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    onChange={this.onChange} />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="job_type">Job Type </label>
                                <input type="Text"
                                    className="form-control"
                                    name="job_type"
                                    placeholder="Enter role"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rank"> Rank </label>
                                <input type="number"
                                    className="form-control"
                                    name="rank"
                                    placeholder="Enter rank"
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AddEmployee)