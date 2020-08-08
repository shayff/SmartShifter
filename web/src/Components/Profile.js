import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getProfile } from './UserFunctions'


class Profile extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            id_number: '',
            phone: '',
            address: '',
            date_of_birth: ''
        }
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        getProfile().then(data =>{
        if(data){
            if (this._isMounted)
            {
                this.setState({
                first_name:data["first name"],
                last_name: data["last name"],
                email: data["email"],
                id_number: data["id number"],
                phone: data["phone"],
                address: data["address"],
                date_of_birth: data["date of birth"]});
                }
            }
    })};
    
    onUpdateClick(path) {
        this.props.history.push(path)
    }


    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Profile</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>{this.state.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{this.state.last_name}</td>
                            </tr>
                            <tr>
                                <td>Id Number</td>
                                <td>{this.state.id_number}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{this.state.phone}</td>
                            </tr>
                            <tr>
                                <td>address</td>
                                <td>{this.state.address}</td>
                            </tr>
                            <tr>
                                <td>Date Of Birth</td>
                                <td>{this.state.date_of_birth}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{this.state.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="btn btn-lg btn-primary btn-block" onClick={() => this.onUpdateClick(`/updateProfile`)}>
                                Update Profile
                     </button>
            </div>
        )
    }
  }

export default withRouter(Profile)
