import React, { Component } from 'react'
import { } from './UserFunctions'

class GenerateShifts extends Component {

    onGgenerateShifts ()
    {

    }

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                         <h1 className="text-center">Generate Shifts</h1>
                    </div>
                    <table className="table table-bordered ">
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col">Sunday</th>
                            <th scope="col">Monday</th>
                            <th scope="col">Tuesday</th>
                            <th scope="col">Wednesday</th>
                            <th scope="col">Thursday</th>
                            <th scope="col">Friday</th>
                            <th scope="col">Saturday</th>                     
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            <th scope="row">Morning</th>
                            </tr>
                            <tr>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            <th scope="row">Afternoon</th>
                            </tr>
                            <tr>
                            <th scope="row">Evening</th>
                            <th scope="row">Evening</th>                                 
                            <th scope="row">Evening</th>                                 
                            <th scope="row">Evening</th>                                 
                            <th scope="row">Evening</th>                                 
                            <th scope="row">Evening</th>                                 
                            <th scope="row">Evening</th>                                                              
                            </tr>
                        </tbody>
                        </table>
                </div>
                      <button type="submit" className="btn btn-lg btn-primary btn-block"  onClick={() => this.onGgenerateShifts()}>
                               Generate 
                    </button>                
            </div>
        )
    }
}

export default GenerateShifts