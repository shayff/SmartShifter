import React, { Component } from 'react';
import './app.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NavBar from './Components/NavBar'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import CreateCompany from './Components/CreateCompany'
import Profile from './Components/Profile'
import Employees from './Components/Employees'
import Shifts from './Components/Shifts'
import Settings from './Components/Settings'
import Messages from './Components/Messages'
import SwitchShifts from './Components/SwitchShifts'
import UpdateProfile from './Components/UpdateProfile'
import AddEmployee from './Components/AddEmployee'
import UpdateSettings from './Components/UpdateSettings'
import UpdateEmployeeInfo from './Components/UpdateEmployeeInfo'
import GenerateShifts from './Components/GenerateShifts'
import EditPreferences from './Components/EditPreferences'
import AddShifts from './Components/AddShifts'
import UpdateShift from './Components/UpdateShift'
import ShowGeneratedShifts from './Components/ShowGeneratedShifts'
import UpdatePassword from './Components/UpdatePassword'
import ProtectedRoute from './Components/ProtectedRoute'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <div className="container">
            <Switch>
            <Route exact path="/" component={Home} />
            <ProtectedRoute exact path="/register" component={Register} />
            <ProtectedRoute exact path="/login" component={Login} />
            <ProtectedRoute exact path="/createCompany" component={CreateCompany} />
            <ProtectedRoute exact path="/profile" component={Profile} />
            <ProtectedRoute exact path="/employees" component={Employees} />
            <ProtectedRoute exact path="/shifts" component={Shifts} />
            <ProtectedRoute exact path="/settings" component={Settings} />
            <ProtectedRoute exact path="/messages" component={Messages} />
            <ProtectedRoute exact path="/switchShifts" component={SwitchShifts} />
            <ProtectedRoute exact path="/updateProfile" component={UpdateProfile} />
            <ProtectedRoute exact path="/addEmployee" component={AddEmployee} />
            <ProtectedRoute exact path="/updateSettings" component={UpdateSettings} />
            <ProtectedRoute exact path="/updateEmployeeInfo" component={UpdateEmployeeInfo} />
            <ProtectedRoute exact path="/editPreferences" component={EditPreferences} />
            <ProtectedRoute exact path="/generateShifts" component={GenerateShifts} />
            <ProtectedRoute exact path="/addShifts" component={AddShifts} />
            <ProtectedRoute exact path="/updateShift" component={UpdateShift} />
            <ProtectedRoute exact path="/showGeneratedShifts" component={ShowGeneratedShifts} />
            <ProtectedRoute exact path="/updatePassword" component={UpdatePassword} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
