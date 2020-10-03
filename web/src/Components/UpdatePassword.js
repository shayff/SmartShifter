import React, { Component } from 'react'
import { updatePassword } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class UpdatePassword extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            currPassword: '',
            newPassword: '',
            newPasswordTypedAgain: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateRegisterForm() {
        const currPassword = document.forms["myForm15"]["currPassword"].value;
        const newPassword = document.forms["myForm15"]["newPassword"].value;
        const newPasswordTypedAgain = document.forms["myForm15"]["newPasswordTypedAgain"].value;
        let validate = true;

        if (currPassword === "" || newPassword === ""|| newPasswordTypedAgain === "")
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

        if(this.validateRegisterForm())
        {
            if(this.state.newPasswordTypedAgain === this.state.newPassword )
            {
                const passwords = 
                {
                    currPassword: this.state.currPassword,
                    newPassword: this.state.newPassword
                }

               updatePassword(passwords).then(res => {
                if(res)
                {
                    console.log("Updated Password");
                    this.props.history.push(`/profile`);
                }   
                else
                {
                    alert("The Current Password That You Entered Is Wrong");

                }})
            }
            else
            {
                alert("The New Passwords Do Not Match");
            }
        }
    }
    
    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm15" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Update Password</h1>
                                <div className="form-group">
                                    <label htmlFor="currPassword">Type Your Current Password</label>
                                    <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="currPassword"
                                    autoComplete="new-password"
                                    placeholder="Enter Password"
                                    onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">Type Your New Password</label>
                                    <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="newPassword"
                                    autoComplete="new-password"
                                    placeholder="Enter Password"
                                    onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">Confrim New Password</label>
                                    <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="newPasswordTypedAgain"
                                    autoComplete="new-password"
                                    placeholder="Enter Password"
                                    onChange={this.onChange} />
                                </div>                                     
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(UpdatePassword)