import React, { Component } from 'react'
import { register } from './UserFunctions'

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
            date_of_birth: ''
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
        const address = document.forms["myForm2"]["address"].value;
        const date_of_birth = document.forms["myForm2"]["date_of_birth"].value;
        let validate = true;

        if (email === "" || passwrod === "" || first_name === ""|| id_number === ""||
             last_name === ""|| phone === "" ||address === "" || date_of_birth === "")
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
            date_of_birth: this.state.date_of_birth
        }

        if(this.validateRegisterForm()) {
        register(newUser).then(res => {
            this.props.history.push(`/login`)
        })
    }
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm2" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    value={this.state.first_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    value={this.state.last_name}
                                    onChange={this.onChange} />
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
                                    value={this.state.id_number}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date Of Birth</label>
                                <input type="date"
                                    className="form-control"
                                    name="date_of_birth"
                                    placeholder="Enter Date Of Birth"
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
                                    placeholder="Enter Phone"
                                    value={this.state.phone}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Enter Address"
                                    value={this.state.address}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Email"
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

export default Register