import React, { Component } from 'react'
import { updateEmployeeInfo,getSettings } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'

class UpdateEmployeeInfo extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            employeeJobTypes: [],
            companyJobTypes: [],
            rank:'',
            id:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onelectOrRemoveJobType = this.onelectOrRemoveJobType.bind(this)
    }

    onelectOrRemoveJobType(selectedList) {
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

    initializeOptions = (arrJobs) => { 
        let options = [];
        arrJobs.map((jobType,index) => (
        options.push({key:index ,value: jobType})));
        return options;
    }

    validateRegisterForm() {
        const rank = document.forms["myForm6"]["rank"].value; 
        const employeeJobTypes = this.state.employeeJobTypes.length;
        let validate = true;

        if (rank === "" || employeeJobTypes === 0)
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
            job_type: this.state.employeeJobTypes,
             id: this.state.id,
            rank:this.state.rank,
        }

        if(this.validateRegisterForm()) {
        updateEmployeeInfo(user).then(res => {
            this.props.history.push(`/employees`)
           })
        }
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        const employee = this.props.location.state.detail;
        
        if (this._isMounted)
        {
            this.setState({
                employeeJobTypes:employee["job type"],
                rank:employee["rank"],
                id: employee["_id"],
            });
        }

        getSettings().then(data => {
            if(data)
            {   
                if (this._isMounted)
                {
                    this.setState({companyJobTypes: data["roles"]});
                }
            }
        });
      }
    
    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form name="myForm6" onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Update Employee Info</h1>
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
                            <div className="form-group">
                            <label htmlFor="Job Type">Job Type</label>
                            <Multiselect
                                style={{searchBox: {background: 'white'}}}
                                options= {this.initializeOptions(this.state.companyJobTypes)}
                                selectedValues={this.initializeOptions(this.state.employeeJobTypes)}
                                displayValue="value"
                                closeIcon="cancel"
                                placeholder="Job Type"
                                avoidHighlightFirstOption= {true}
                                hidePlaceholder={true}
                                onSelect={this.onelectOrRemoveJobType}
                                onRemove={this.onelectOrRemoveJobType}/><br/>
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