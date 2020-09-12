import React, { Component } from 'react'
import { addEmployee, getSettings } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'
import moment from 'moment'

class AddEmployee extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            email: '',
            time_of_joining:'',
            rank:'',
            companyJobTypes: [],
            employeeJobTypes: []
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onRemoveJobType = this.onRemoveJobType.bind(this)
    }

    onRemoveJobType(selectedList) {
        if (this._isMounted)
        {
            let jobTypes=[];
            for(let i=0; i<selectedList.length; i++)
            {
                jobTypes.push(selectedList[i].value)
            }

            this.setState({employeeJobTypes: jobTypes});
        }
    }

    validateRegisterForm() {
        const email = document.forms["myForm3"]["email"].value;
        const employeeJobTypes = this.state.employeeJobTypes.length;
        const rank = document.forms["myForm3"]["rank"].value; 
        let validate = true;

        if (email === "" || employeeJobTypes === 0 || rank === "" )
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount()
    {
        this._isMounted = true;

         getSettings().then(data => {
            if(data)
            {   
                if (this._isMounted)
                {
                    this.setState({companyJobTypes: data["roles"],
                                   employeeJobTypes: data["roles"]});
                }
            }
        });
    };

    onChange (e) {
        if (this._isMounted)
        {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    initializeOptions = () => { 
        let options = [];
        this.state.companyJobTypes.map((jobType,index) => (
        options.push({key:index ,value: jobType})));
        return options;
    }

    onSubmit (e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            job_type: this.state.employeeJobTypes,
            rank: this.state.rank,
            time_of_joining: moment().format(),
        }

        if(this.validateRegisterForm()) 
        {
            addEmployee(user).then(res => {
                this.props.history.push(`/employees`)})
        }   
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm3" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Add Employee</h1>
 
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Email"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rank">Rank</label>
                                <input type="number"
                                    min="1" 
                                    max="5"
                                    className="form-control"
                                    name="rank"
                                    placeholder="Enter rank"
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                            <label htmlFor="Job Type">Job Type</label>
                            <Multiselect
                                style={{searchBox: {background: 'white'}}}
                                options= {this.initializeOptions()}
                                displayValue="value"
                                closeIcon="cancel"
                                placeholder="Choose Job Type"
                                avoidHighlightFirstOption= {true}
                                hidePlaceholder={true}
                                onRemove={this.onRemoveJobType}/><br/>
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