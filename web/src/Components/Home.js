import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import logo from '../assests/SmartShifterLogo.png';

class Home extends Component {
    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center" style={{color:'#03A9F4'}}> Welcome </h1>
                        <img src={logo} alt="Logo" height={600} width={700}/>
                    </div>
                </div>
                     <p className="text-center"> Copyright © SmartShifter {new Date().getFullYear()}. </p>
                <div>
                </div>
            </div>
        )
    }
}

export default withRouter(Home)

