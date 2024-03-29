import React, { Component } from 'react'
import { register } from './UserFunctions'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            id_number: '',
            phone: '',
            address: '',
            date_of_birth: '',
            gender:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateRegisterForm() {
        const first_name = document.forms["myForm2"]["first_name"].value;
        const last_name = document.forms["myForm2"]["last_name"].value;
        const email = document.forms["myForm2"]["email"].value;
        const passwrod = document.forms["myForm2"]["password"].value;
        const id_number = document.forms["myForm2"]["id_number"].value;
        const phone = document.forms["myForm2"]["phone"].value;
        const date_of_birth = document.forms["myForm2"]["date_of_birth"].value;
        let validate = true;

        if (email === "" || passwrod === "" || first_name === ""|| id_number === ""||
             last_name === ""|| phone === "" || date_of_birth === "")
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

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            id_number: this.state.id_number,
            phone: this.state.phone,
            address: this.state.address,
            date_of_birth: this.state.date_of_birth,
            gender: this.state.gender
        }

        if(this.validateRegisterForm()) {
        register(newUser).then(res => {
            if(res.ok)
            {
                console.log("Registered")
                this.props.history.push(`/login`)
            }
            else
            {
                alert(res.msg)
            }
        })}
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm2" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Enter Your First Name"
                                    value={this.state.first_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Enter Your Last Name"
                                    value={this.state.last_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender (Option)</label>
                                <select className="custom-select" id="inputGroupSelect02" name="gender" onChange={this.onChange}>
                                    <option value="" hidden>Choose Your Gender</option >
                                    <option value="Male">Male</option >
                                    <option value="Female">Female</option >
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_number">Id Number</label>
                                <input type="text"
                                    pattern="[0-9]*"
                                    minLength="9"
                                    maxLength="9"
                                    className="form-control"
                                    name="id_number"
                                    placeholder="Enter Your Id Number"
                                    value={this.state.id_number}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date Of Birth</label>
                                <input type="date"
                                    className="form-control"
                                    name="date_of_birth"
                                    max= {moment().format('YYYY-MM-DD')}
                                    placeholder="Enter Your Date Of Birth"
                                    value={this.state.date_of_birth}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input type="text"
                                    pattern="[0-9]*"
                                    maxLength="10"
                                    className="form-control"
                                    name="phone"
                                    placeholder="Enter Your Phone"
                                    value={this.state.phone}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address (Option)</label>
                                <input type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Enter Your Address"
                                    value={this.state.address}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Your Email"
                                    value={this.state.email}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password </label>
                                <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    autoComplete="new-password"
                                    value={this.state.password}
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register)