import React, { Component } from 'react'
import { updateSettings, getSettings } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'

class UpdateSettings extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            company_name: '',
            company_address: '',
            switch_shifts: '',
            amout_of_shifts: '',
            companyJobTypes: [],
            jobType:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onRemoveJobType = this.onRemoveJobType.bind(this)
    }

    onRemoveJobType(selectedList) {
        this.setState({companyJobTypes: selectedList});
    }

    validateRegisterForm() 
    {
        const company_name = document.forms["MyForm5"]["company_name"].value;
        const company_address = document.forms["MyForm5"]["company_address"].value;
        const amout_of_shifts = document.forms["MyForm5"]["amout_of_shifts"].value;
        const companyJobTypes = this.state.companyJobTypes.length;
        let validate = true;

        if (company_name === "" || company_address === "" || amout_of_shifts === "" || companyJobTypes === 0)
        {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
    }

    onAddJobType()
    {
        if(this.state.jobType !== '')
        {
            let newcompanyJobTypes = this.state.companyJobTypes;
            newcompanyJobTypes.push(this.state.jobType)
            this.setState({ companyJobTypes: newcompanyJobTypes,
                            jobType:'' },() => document.getElementById('jobTypeInput').value = '');
        }
        else
        {
            alert("Job Type Must Be Filled To Add It");
        }
    }

    onChange(e)
    {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChange = () => {
        this.setState({ switch_shifts: !this.state.switch_shifts });
    }

    onSubmit (e) {
        e.preventDefault()

        const newSettings = {
            company_name: this.state.company_name,
            companyJobTypes: this.state.companyJobTypes,
            settings:{
            can_employee_switch_shifts: this.state.switch_shifts,
            shifts_required_from_emp: this.state.amout_of_shifts,
            address: this.state.company_address
            }
        }

        if(this.validateRegisterForm()) {
            updateSettings(newSettings).then(res => {
            this.props.history.push(`/settings`)
          })
        }
    }

    initializeOptions = () => { 
        let options = [];
        this.state.companyJobTypes.map((jobType,index) => (
        options.push({key:index ,value: jobType})));
        return options;
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        getSettings().then(data =>{
            if(data){
                if (this._isMounted)
                {
                    this.setState({
                    company_name:data["company name"],
                    company_address: data.settings["address"],
                    switch_shifts: data.settings["can_employee_switch_shifts"],
                    amout_of_shifts: data.settings["shifts_required_from_emp"],
                    companyJobTypes: data["roles"]});
                }
            }
        })
    }
    
    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="MyForm5" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Update Settings</h1>
                            <div className="form-group">
                                <label htmlFor="company_name">Company Name </label>
                                <input type="text"
                                    className="form-control"
                                    name="company_name"
                                    placeholder="Enter Company Name"
                                    value={this.state.company_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="company_address">Company Address</label>
                                <input type="text"
                                    className="form-control"
                                    name="company_address"
                                    placeholder="Enter Company Address"
                                    value={this.state.company_address}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group" style={{marginLeft:"25px"}}>
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
                            <div className="form-group">
                            <label htmlFor="amout_of_shifts">Company Job Types</label>
                            <Multiselect
                                style={{searchBox: {background: 'white'}}}
                                selectedValues={this.initializeOptions()}
                                displayValue="value"
                                closeIcon="cancel"
                                placeholder="Update Job Types"
                                avoidHighlightFirstOption= {true}
                                hidePlaceholder={true}
                                onRemove={this.onRemoveJobType}/><br/>
                                <input type="text"
                                    id="jobTypeInput"
                                    className="form-control"
                                    name="jobType"
                                    style={{marginBottom:"10px"}}
                                    placeholder="Enter job Type"
                                    onChange={this.onChange} />
                                <button type="button" className="btn btn-lg btn-primary" onClick={() => this.onAddJobType()}>
                                    Add Job Type
                                </button>
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

export default withRouter(UpdateSettings)
