import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings ,ListOfEmployees, removeEmployee } from './UserFunctions'
import { Multiselect } from 'multiselect-react-dropdown'

class Employees extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { empArry: [],
            company_name:'',
            filter: [],
            companyJobTypes:[]
        }

        this.onSelectOrRemoveJobTypes = this.onSelectOrRemoveJobTypes.bind(this)
    }

    filterEmployees(employees,optionsFilter)
    {
        let employeesFilterd = [];
        employeesFilterd = employees.filter((employee) => { 
            for(let i=0 ; i<optionsFilter.length; i++)
            {
                if(employee["job type"].indexOf(optionsFilter[i])>-1)
                {
                    return true;
                }
            }

            return false;
        });

        return employeesFilterd;
    }

    initializeTable = (employees,optionsFilter) => 
    {
        if(employees)
        {
            let employeesFilterd = this.filterEmployees(employees,optionsFilter);
            
         return employeesFilterd.map((employee,index) => (
            <tr key = {index} className="text-center">
            <th scope="row"> {index + 1}</th>
            <td>{employee["first name"]}</td>
            <td>{employee["last name"]}</td>
            <td>{employee["id number"]}</td>
            <td>{employee["job type"].map((jobType,index) => <li key = {index}>{jobType}</li>)} </td>
            <td>{employee["phone"]}</td>
            <td>{employee["email"]}</td>
            <td>{employee["address"]}</td>
            <td>{employee["date of birth"]}</td>
            <td>{employee["time_created"]}</td>
            <td>{employee["rank"]}</td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onUpdateInfoEmployee(`/updateEmployeeInfo`,employee)}>
                            {<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
                                <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
                            </svg>}<br/>Update Info
            </button>
            </td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onRemoveEmployee(employee)}>
                            {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-person-dash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5-.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                            </svg>}<br/>Remove Employee
            </button>
            </td>
            </tr>
         ));
        }
    }

    onUpdateInfoEmployee(path, employee)
    {
         this.props.history.push(path, { detail: employee})
    }

    getListListOfEmployees()
    {
        ListOfEmployees().then(data => {
            if (data && data.length === 0)
            {
                alert("No Employees To Show")
            }
            if(this._isMounted)
            {
                this.setState({empArry:data});
            }
        });   
    }

    initializeOptions = () => { 
        let options = [];
        this.state.companyJobTypes.map((jobType,index) => (
        options.push({key:index ,value: jobType})));
        return options;
    }

    onSelectOrRemoveJobTypes(selectedList) 
    {
        let newFilter=[];
        for(let i=0; i<selectedList.length; i++)
        {
            newFilter.push(selectedList[i].value)
        }
        this.setState({filter: newFilter},() => this.initializeTable(this.state.empArry,this.state.filter));
    }

    onRemoveEmployee(employee) {     
        removeEmployee(employee).then(()=> {
             this.getListListOfEmployees();
        });
    }

    onAddEmployee(path) {
        this.props.history.push(path);
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        
        this.getListListOfEmployees();
        
        getSettings().then(data => {
            if(data)
            {   
                if (this._isMounted)
                {
                    this.setState({company_name: data["company name"],
                                   companyJobTypes: data["roles"],
                                   filter: data["roles"]});
                }
            }
        });
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5" style={{display: 'inline-block', marginLeft: '-10%'}}>
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                             {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-person-lines-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm2 9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                            </svg>} {this.state.company_name} Employees</h1>
                    </div>
                    <table className="table table-bordered table-hover" >
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col" className="text-center">#</th>
                            <th scope="col" className="text-center">First Name</th>
                            <th scope="col" className="text-center">Last Name</th>
                            <th scope="col" className="text-center">ID</th>
                            <th scope="col" className="text-center">Job Type</th>
                            <th scope="col" className="text-center">Phone</th>
                            <th scope="col" className="text-center">Email</th>
                            <th scope="col" className="text-center">Address</th>
                            <th scope="col" className="text-center">Date Of Birth</th>
                            <th scope="col" className="text-center">Time Of Joining</th>
                            <th scope="col" className="text-center">Rank</th>
                            <th scope="col" className="text-center"></th>
                            <th scope="col" className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.initializeTable(this.state.empArry,this.state.filter)}
                        </tbody>
                        </table>
                        <div>
                            <label htmlFor="employees_for_shift">Filter By Job Type</label>   
                            <Multiselect
                            options= {this.initializeOptions()}
                            style={{searchBox: {background: 'white'}}}
                            selectedValues={this.initializeOptions()}
                            displayValue="value"
                            closeIcon="cancel"
                            placeholder="Choose Job Type"
                            avoidHighlightFirstOption= {true}
                            hidePlaceholder={true}
                            onSelect={this.onSelectOrRemoveJobTypes}
                            onRemove={this.onSelectOrRemoveJobTypes}/>
                        </div>
                </div >
                      <button type="submit" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '5%'}} onClick={() => this.onAddEmployee(`/addEmployee`)}>
                        {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                                        <path fillRule="evenodd" d="M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
                        </svg>}<br/>Add Employee
                    </button>                
            </div>
        )
    }
}

export default withRouter(Employees)