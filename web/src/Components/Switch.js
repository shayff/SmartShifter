import React, { Component } from 'react'
import { getSwitches,approveSwitches } from './UserFunctions'

class Switch extends Component {
    constructor() {
        super()
        this.state = { switchData: []
        }
    }

    componentDidMount ()
    {
       getSwitches().then(data =>{
        console.log(data)
           if (data)
           {
              this.setState({/**/});
           }
       });   
   }

    onUApproveSwitch() {
        approveSwitches();
    }

    onDontApproveSwitch() {

    }

    initializeTable= (data) => {
        if(data)
        {
         return data.map((switchData,index) => (
            <tr key = {index} >
            <th scope="row"> {index}</th>
            <td>{data["first name"]} + {data["Last name"]}</td>
            <td>{data["first name"]} + {data["Last name"]}</td>
            <td>{data["first name"]} + {data["Last name"]}</td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onUApproveSwitch()}>
                                Approve Switch
            </button>
            </td>
            <td>
            <button type="submit" className="btn-lg btn-primary btn-block" onClick={() => this.onDontApproveSwitch()}>
                                Don't Approve Switch
            </button>
            </td>
            </tr>
         ));
        }
    }

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center"> Switching Shifts </h1>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">The Shift</th>
                            <th scope="col">The One Who Want To Switch</th>
                            <th scope="col">The One Who Want To Get</th>
                            <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.initializeTable(/**/)}
                        </tbody>
                        </table>
                </div>
            </div>
        )
    }
}

export default Switch