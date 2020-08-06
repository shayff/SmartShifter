import React, { Component } from 'react'
import { updateEmployeeInfo } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class UpdateEmployeeInfo extends Component {
    constructor() {
        super()
        this.state = {
            // first_name: '',
            // last_name: '',
            // gender:'',
            // id_number: '',
            // phone: '',
            // address: '',
            // date_of_birth: '',
            job_type:'',
            rank:'',
            id:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateRegisterForm() {
        // const first_name = document.forms["myForm6"]["first_name"].value;
        // const last_name = document.forms["myForm6"]["last_name"].value;
        // const id_number = document.forms["myForm6"]["id_number"].value;
        // const phone = document.forms["myForm6"]["phone"].value;
        // const address = document.forms["myForm6"]["address"].value;
        // const date_of_birth = document.forms["myForm6"]["date_of_birth"].value;
        const rank = document.forms["myForm6"]["rank"].value; 
        const job_type = document.forms["myForm6"]["job_type"].value;
     //   const gender = document.forms["myForm6"]["gender"].value;
        let validate = true;

        if (job_type === "" || rank === "" /*first_name === ""|| id_number === ""|| last_name === ""|| phone === "" 
        ||address === "" || date_of_birth === "" || gender ===""*/)
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
            // id_number: this.state.id_number,
            // phone: this.state.phone,
            // address: this.state.address,
            // date_of_birth: this.state.date_of_birth,
            job_type: this.state.job_type,
          //  time_of_joining: Date.now(),
             id: this.state.id,
            rank:this.state.rank,
     //       gender: this.state.gender
        }

        if(this.validateRegisterForm()) {
        updateEmployeeInfo(user).then(res => {
            this.props.history.push(`/employees`)
           })
        }
    }

    componentDidMount(){
        const employee = this.props.location.state.detail;
        this.setState({
            // first_name:employee["first name"],
            // last_name: employee["last name"],
            // id_number: employee["id number"],
            // phone: employee["phone"],
            // address: employee["address"],
            // date_of_birth: employee["date of birth"],
        //    gender:employee["gender"],
            job_type:employee["job type"],
            rank:employee["rank"],
            id: employee["_id"],
        });
      }
    
    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm6" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Update Employee Info</h1>
                            {/* <div className="form-group">
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
                                <label htmlFor="gedner">Gedner</label>
                                <input type="radio"
                                    placeholder="Female"
                                    name="gender"
                                    value={this.state.gender}
                                    onChange={this.onChange} />
                                  Female
                                 <input type="radio"
                                    value="Male"
                                    name="gender"
                                    value={this.state.gender}
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
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="job_type">Job Type </label>
                                <input type="Text"
                                    className="form-control"
                                    name="job_type"
                                    placeholder="Enter Updated Job Type"
                                    value={this.state.job_type}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rank"> Rank </label>
                                <input type="number"
                                    className="form-control"
                                    min="1" 
                                    max="5"
                                    name="rank"
                                    placeholder="Enter Updated Rank"
                                    value={this.state.rank}
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

export default withRouter(UpdateEmployeeInfo)