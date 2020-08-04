import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings } from './UserFunctions'

class Settings extends Component {
    constructor() {
        super()
        this.state = {
            company_name: '',
            company_address: '',
            switch_shifts: '',
            amout_of_shifts: '',
        }
    }

    onUpdateClick(path) {
        this.props.history.push(path)
    }

    componentDidMount(){
        getSettings().then(data =>{
        if(data){
         this.setState({
         company_name:data["company name"],
         company_address: data.settings["address"],
         switch_shifts: data.settings["can_employee_switch_shifts"] === true ? "Yes" : "No" ,
         amout_of_shifts: data.settings["shifts_required_from_emp"]});
             }
    })};

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center"> Company Settings </h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                            <td>Company Name</td>
                                <td>{this.state.company_name}</td>
                            </tr>
                            <tr>
                            <td>Company Address</td>
                                <td>{this.state.company_address}</td>
                            </tr>
                            <tr>
                            <td>Can Employees Switch Shifts?</td>
                                <td>{this.state.switch_shifts}</td>
                            </tr>
                            <tr>
                            <td>Amount Of Shifts Required Per Week</td>
                                <td>{this.state.amout_of_shifts}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onUpdateClick(`/updateSettings`)}>
                                Update Settings
                </button>
            </div>
        )
    }
}

export default withRouter(Settings)
