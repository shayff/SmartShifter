import React, { Component } from 'react'
import { login } from './UserFunctions'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    validateLoginForm() {
        const email = document.forms["myForm"]["email"].value;
        const passwrod = document.forms["myForm"]["password"].value;
        let validate = true;
        
        if (email === "" || passwrod === "") {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
      }

    onSubmit (e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        if(this.validateLoginForm()) 
        {
        login(user).then(res => {
            if (res) {
                if(localStorage.getItem('hasCompany') === 'true')
                {
                    this.props.history.push(`/profile`)
                }
                else
                {
                    this.props.history.push(`/createCompany`)
                }
            }
            else
            {
                alert("One Of The Fields Is Incorrect, Try Again");
            }
         })
        }
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm" onSubmit={this.onSubmit}>  
                            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
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
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login