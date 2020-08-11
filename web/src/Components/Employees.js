import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings ,ListOfEmployees, removeEmployee } from './UserFunctions'

class Employees extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { empArry: [],
            company_name:''
        }
    }

    initializeTable= (employees) => {
        if(employees)
        {
         return employees.map((employee,index) => (
            <tr key = {index} className="text-center">
            <th scope="row"> {index + 1}</th>
            <td>{employee["first name"]}</td>
            <td>{employee["last name"]}</td>
             {/* <td>{employee["gender"]}</td>  */}
            <td>{employee["id number"]}</td>
            <td>{employee["job type"]}</td>
            <td >{employee["phone"]}</td>
            <td>{employee["email"]}</td>
            <td>{employee["address"]}</td>
            <td>{employee["date of birth"]}</td>
            <td>{employee["time_created"]}</td>
            <td>{employee["rank"]}</td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onUpdateInfoEmployee(`/updateEmployeeInfo`,employee)}>
                                Update Info
            </button>
            </td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onRemoveEmployee(employee)}>
                                Remove Employee
            </button>
            </td>
            </tr>
         ));
        }
    }

    onUpdateInfoEmployee(path, employee) {
         this.props.history.push(path, { detail: employee})
    }

    getListListOfEmployees()
    {
        ListOfEmployees().then(data =>{
            if (data)
            {
                if(this._isMounted)
                {
                    this.setState({empArry:data});
                }
            }
        });   
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
                    this.setState({company_name: data["company name"]});
                }
            }
        });
    }

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5" style={{display: 'inline-block', marginLeft: '-10%'}}>
                    <div className="col-sm-8 mx-auto">
                         <h1 className="text-center"> {this.state.company_name} Employees</h1>
                    </div>
                    <table className="table table-bordered table-hover" >
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col" className="text-center">#</th>
                            <th scope="col" className="text-center">First Name</th>
                            <th scope="col" className="text-center">Last Name</th>
                            {/* <th scope="col" className="text-center">Gender</th> */}
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
                            {this.initializeTable(this.state.empArry)}
                        </tbody>
                        </table>
                </div >
                      <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAddEmployee(`/addEmployee`)}>
                                Add Employee
                    </button>                
            </div>
        )
    }
}

export default withRouter(Employees)