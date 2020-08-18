import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import logo from '../assests/SmartShifterLogo.png';
import conferenceVideo from '../assests/conferenceVideo.mp4';
import happyPeople from '../assests/happyPeople.mp4';
import schedule from '../assests/pexels-bich-tran-760710.jpg';

class Home extends Component {
    render () {
        return (
            <div className="container">
                <div style={{marginTop:'50px',marginBottom:'50px'}}>
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center"> Welcome </h1><br/> 
                        <img src={logo} alt="Logo" height={600} width={700}/>
                    </div>
                </div>
                <div className="row" style={{ content: "",clear: 'both',display: 'table'}}>
                    <div className="column" style={{float: 'left',width: '33.33%',padding: '5px'}}>
                        <video autoPlay loop muted style={{width:'100%'}}>
                            <source src={conferenceVideo} type="video/mp4"/>
                        </video>     
                    </div>
                    <div className="column" style={{float: 'left',width: '33.33%',padding: '5px'}}>
                        <img src={schedule} alt="schedule"style={{width:'100%'}}/>
                    </div>
                    <div className="column" style={{float: 'left',width: '33.33%',padding: '5px'}}>
                        <video autoPlay loop muted style={{width:'100%'}}>
                            <source src={happyPeople} type="video/mp4"/>
                        </video>        
                    </div>
                </div>
                <p className="text-center" style={{marginTop:'100px',fontSize:'17px'}}> Copyright © SmartShifter {new Date().getFullYear()}. </p>
            </div>
        )
    }
}

export default withRouter(Home)