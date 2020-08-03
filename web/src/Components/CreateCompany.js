import React, { Component } from 'react'
import { createCompany } from './UserFunctions'

class CreateCompany extends Component {
    constructor() {
        super()
        this.state = {
            company_name:'',
            company_address:'',
            switch_shifts: '',
            amout_of_shifts: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    validateRegisterForm() {
        const company_name = document.forms["myForm12"]["company_name"].value;
        const company_address = document.forms["myForm12"]["company_address"].value;
        const amout_of_shifts = document.forms["myForm12"]["amout_of_shifts"].value;
        let validate = true;

        if (company_name === "" || company_address === "" || amout_of_shifts === "")
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
      }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChange = () => {
        this.setState({ switch_shifts: !this.state.switch_shifts });
    }

    onSubmit (e) {
        e.preventDefault()

        const newCompany = 
        {
            company_name: this.state.company_name,
            settings:{
            can_employee_switch_shifts: this.state.switch_shifts,
            shifts_required_from_emp: this.state.amout_of_shifts,
            address: this.state.company_address
            }
        }

        if(this.validateRegisterForm()) {
            createCompany(newCompany).then(res => {
            this.props.history.push(`/profile`)
        })}
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm12" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Create Company</h1>
                            <div className="form-group">
                                <label htmlFor="first_name">Company Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="company_name"
                                    placeholder="Enter The Company Name"
                                    value={this.state.company_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="first_name">Company Address</label>
                                <input type="text"
                                    className="form-control"
                                    name="company_address"
                                    placeholder="Enter The Company Address"
                                    value={this.state.company_address}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                 <input type="checkbox"
                                    className="form-check-input"
                                    name="switch_shifts"
                                    onChange={this.handleChange}
                                    checked={this.state.switch_shifts} /> 
                                <label htmlFor="switch_shifts">Can Employees Switch Shifts?</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="amout_of_shifts">Amount Of Shifts Required Per Week</label>
                                <input type="number"
                                    className="form-control"
                                    name="amout_of_shifts"
                                    placeholder="Enter Amount"
                                    value={this.state.amout_of_shifts}
                                    onChange={this.onChange} />
                            </div> 
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                Create Company
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateCompany