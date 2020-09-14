import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings ,listOfEmployees, removeEmployee } from './UserFunctions'
import { Multiselect } from 'multiselect-react-dropdown'

class Employees extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { empArry: [],
            company_name:'',
            jobTypeFilter: [],
            companyJobTypes:[],
            isEmployeeFilterAllChosen: true,
            employeeFilterViewOptions: [{key:'All' ,value: 'All'}],
            employeeFilter: [{key:'All' ,value: 'All'}]
        }

        this.onSelectOrRemoveJobTypes = this.onSelectOrRemoveJobTypes.bind(this)
        this.onSelectOrRemoveEmployee = this.onSelectOrRemoveEmployee.bind(this)
    }

    isAllOptionInArray(array)
    {
        for(let i = 0; i<array.length; i++)
        {
            if(array[i].key === 'All')
            {
                return true;
            }
        }

        return false
    }

    initializeEmployeeOptions = () => { 
        let employeeOptions = [{key:'All' ,value: 'All'}];
        this.state.empArry.map((employee) => (
        employeeOptions.push({key:employee["_id"] ,value: employee["first_name"] + ' ' + employee["last_name"] ,cat: employee["job_type"]})
        ));
        return employeeOptions;
    }

    onSelectOrRemoveEmployee(selectedList) 
    {
        let newFilter=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.empArry.length; i++)
            {
                newFilter.push(parseInt(this.state.empArry[i]["_id"]))
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                newFilter.push(parseInt(selectedList[i].key))
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({employeeFilter: newFilter,
                       employeeFilterViewOptions: showView,
                       isEmployeeFilterAllChosen: isAllChosen}, () => this.initializeTable(this.state.messages,this.state.jobTypeFilter,this.state.employeeFilter));
    }

    filterEmployees(employees,jobTypeFilter,employeeFilter)
    {
        let employeesFilterd = [];
        employeesFilterd = employees.filter((employee) => { 
            if(this.isAllOptionInArray(employeeFilter))
            { 
                for(let i=0 ; i<jobTypeFilter.length; i++)
                {
                    if(employee["job_type"].indexOf(jobTypeFilter[i])>-1)
                    {
                        return true;
                    }
                }
            }
            else
            {
                for(let i=0 ; i<employeeFilter.length; i++)
                {
                    for(let j=0 ; j<jobTypeFilter.length; j++)
                    {
                        if(employee['_id'] === employeeFilter[i] && employee["job_type"].indexOf(jobTypeFilter[j])>-1)
                        {
                            return true;
                        }
                    }
                }
            }
          
            return false;
        });

        return employeesFilterd;
    }

    initializeTable = (employees,jobTypeFilter,employeeFilter) => 
    {
        if(employees)
        {
            let employeesFilterd = this.filterEmployees(employees,jobTypeFilter,employeeFilter);
            
         return employeesFilterd.map((employee,index) => (
            <tr key = {index} className="text-center">
            <th scope="row"> {index + 1}</th>
            <td>{employee["first_name"]}</td>
            <td>{employee["last_name"]}</td>
            <td>{employee["id_number"]}</td>
            <td>{employee["job_type"].join(', ')}</td>
            <td>{employee["phone"]}</td>
            <td>{employee["email"]}</td>
            <td>{employee["address"]}</td>
            <td>{employee["date_of_birth"]}</td>
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
            <td>
                <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onSendMessage('/messages',employee)}>
                                {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-chat-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
                                </svg>}<br/>Send Message
                </button>
            </td>
            </tr>
         ));
        }
    }

    onSendMessage(path, employee)
    {
        this.props.history.push(path, { detail: employee, from: "Employees"})
    }

    onUpdateInfoEmployee(path, employee)
    {
         this.props.history.push(path, { detail: employee})
    }

    getListListOfEmployees()
    {
        listOfEmployees().then(employees => {
            if (employees && employees.length === 0)
            {
                alert("No Employees To Show")
            }
            if(this._isMounted)
            {
                this.setState({empArry:employees});
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
        this.setState({jobTypeFilter: newFilter},() => this.initializeTable(this.state.empArry,this.state.jobTypeFilter,this.state.employeeFilter));
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
                    this.setState({company_name: data["company_name"],
                                   companyJobTypes: data["roles"],
                                   jobTypeFilter: data["roles"]});
                }
            }
        });
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5" style={{display: 'inline-block', marginLeft: '-20%'}}>
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                             {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-person-lines-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm2 9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                            </svg>} {this.state.company_name} Employees</h1>
                    </div>
                    <div style = {{overflowY: 'auto', maxHeight:"635px"}}>
                        <table className="table table-bordered table-hover">
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
                                <th scope="col" className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.initializeTable(this.state.empArry,this.state.jobTypeFilter,this.state.employeeFilter)}
                            </tbody>
                            </table>
                        </div>
                        <div>
                            <label htmlFor="employee_filter"> Filter By Employee </label>   
                            <Multiselect
                            id='employee_filterFilter'
                            options= {this.initializeEmployeeOptions()}
                            selectedValues={this.state.employeeFilterViewOptions}
                            selectionLimit={this.state.isEmployeeFilterAllChosen === true ? '1' : null}
                            style={{searchBox: {background: 'white'}}}
                            displayValue="value"
                            groupBy="cat"
                            closeIcon="cancel"
                            placeholder="Choose Employee"
                            avoidHighlightFirstOption= {true}
                            hidePlaceholder={true}
                            onSelect={this.onSelectOrRemoveEmployee}
                            onRemove={this.onSelectOrRemoveEmployee}/>
                        </div>
                        <div>
                            <label htmlFor="job_type_filter">Filter By Job Type</label>   
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
                      <button type="button" className="btn btn-lg btn-primary btn-block" style={{marginLeft: '5%'}} onClick={() => this.onAddEmployee(`/addEmployee`)}>
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