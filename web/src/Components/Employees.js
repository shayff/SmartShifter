import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings ,ListOfEmployees, removeEmployee } from './UserFunctions'

class Employees extends Component {
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
            <tr key = {index} >
            <th scope="row" className="text-center"> {index + 1}</th>
            <td className="text-center">{employee["first name"]}</td>
            <td className="text-center">{employee["last name"]}</td>
             {/* <td className="text-center">{employee["gender"]}</td>  */}
            <td className="text-center">{employee["id number"]}</td>
            <td className="text-center">{employee["job type"]}</td>
            <td className="text-center">{employee["phone"]}</td>
            <td className="text-center">{employee["email"]}</td>
            <td className="text-center">{employee["address"]}</td>
            <td className="text-center">{employee["date of birth"]}</td>
            <td className="text-center">{employee["time_created"]}</td>
            <td className="text-center">{employee["rank"]}</td>
            <td className="text-center">
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
                this.setState({empArry:data});
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

    componentDidMount () {
    this.getListListOfEmployees(); 
    getSettings().then(data => {
        if(data)
        {
            this.setState({company_name: data["company name"]});
        }
    });
    }

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                         <h1 className="text-center">  {this.state.company_name} Employees</h1>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col" className="text-center">#</th>
                            <th scope="col" className="text-center">First Name</th>
                            <th scope="col" className="text-center">Last Name</th>
                            {/* <th scope="col" className="text-center">Gender</th> */}
                            <th scope="col" className="text-center">Id</th>
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
                </div>
                      <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onAddEmployee(`/addEmployee`)}>
                                Add Employee
                    </button>                
            </div>
        )
    }
}

export default withRouter(Employees)