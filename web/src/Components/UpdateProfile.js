import React, { Component } from 'react'
import { updateProfile, getProfile } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class UpdateProfile extends Component {
    _isMounted = false;

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
        const first_name = document.forms["myForm4"]["first_name"].value;
        const last_name = document.forms["myForm4"]["last_name"].value;
        const email = document.forms["myForm4"]["email"].value;
        const passwrod = document.forms["myForm4"]["password"].value;
        const id_number = document.forms["myForm4"]["id_number"].value;
        const phone = document.forms["myForm4"]["phone"].value;
        const address = document.forms["myForm4"]["address"].value;
        const date_of_birth = document.forms["myForm4"]["date_of_birth"].value;
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

        const user = {
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
        updateProfile(user).then(res => {
            this.props.history.push(`/profile`)
        })}
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        getProfile().then(data =>{
            if(data){
                if (this._isMounted)
                {
                    this.setState({
                    first_name:data["first name"],
                    last_name: data["last name"],
                    email: data["email"],
                    id_number: data["id number"],
                    phone: data["phone"],
                    address: data["address"],
                    date_of_birth: data["date of birth"]});
                }
            }
        })
    }
    
    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm4" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Update Profile</h1>
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
                                    data-date="" 
                                    data-date-format="DD MM YYYY"
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
                                    value= {this.state.email}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password </label>
                                <input type="password"
                                    minLength="5"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(UpdateProfile)