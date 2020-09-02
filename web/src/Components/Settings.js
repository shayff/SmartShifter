import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getSettings } from './UserFunctions'

class Settings extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            company_name: '',
            company_address: '',
            switch_shifts: '',
            amout_of_shifts: '',
            companyJobTypes: []
        }
    }

    onUpdateClick(path) {
        this.props.history.push(path)
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
                switch_shifts: data.settings["can_employee_switch_shifts"] === true ? "Yes" : "No" ,
                amout_of_shifts: data.settings["shifts_required_from_emp"],
                companyJobTypes: data["roles"]});
                }
            }
    })};

    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            {<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-sliders" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM11.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM4.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9.5 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM11.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                <path fillRule="evenodd" d="M9.5 4H0V3h9.5v1zM16 4h-2.5V3H16v1zM9.5 14H0v-1h9.5v1zm6.5 0h-2.5v-1H16v1zM6.5 9H16V8H6.5v1zM0 9h2.5V8H0v1z"/>
                            </svg>} Company Settings </h1>
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
                            <tr>
                            <td>Company Job Types</td>
                                <td>{this.state.companyJobTypes.map((jobType,index) => <li key = {index}> {jobType} </li>)} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onUpdateClick(`/updateSettings`)}>
                        {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
                            <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
                        </svg>}<br/> Update Settings
                </button>
            </div>
        )
    }
}

export default withRouter(Settings)
