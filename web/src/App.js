import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Profile from './Components/Profile'
import Employees from './Components/Employees'
import Shifts from './Components/Shifts'
import Settings from './Components/Settings'
import Messages from './Components/Messages'
import Switch from './Components/Switch'
import UpdateProfile from './Components/UpdateProfile'
import AddEmployee from './Components/AddEmployee'
import UpdateSettings from './Components/UpdateSettings'
import UpdateEmployeeInfo from './Components/UpdateEmployeeInfo'
import GenerateShifts from './Components/GenerateShifts'
import EditShifts from './Components/EditShifts'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Home} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/employees" component={Employees} />
            <Route exact path="/shifts" component={Shifts} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/messages" component={Messages} />
            <Route exact path="/switch" component={Switch} />
            <Route exact path="/updateProfile" component={UpdateProfile} />
            <Route exact path="/addEmployee" component={AddEmployee} />
            <Route exact path="/updateSettings" component={UpdateSettings} />
            <Route exact path="/updateEmployeeInfo" component={UpdateEmployeeInfo} />
            <Route exact path="/editShifts" component={EditShifts} />
            <Route exact path="/generateShifts" component={GenerateShifts} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
