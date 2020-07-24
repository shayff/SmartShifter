import React, { Component } from 'react'
import { getSwitches,approveSwitches } from './UserFunctions'

class Switch extends Component {
    constructor() {
        super()
        this.state = { 
            switchData: [],
            filter: "All",
        }
        this.onChange = this.onChange.bind(this)

    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
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
                            <th scope="col">The One Who Want To Switch The Shift</th>
                            <th scope="col">The One Who Want To Get The Shift</th>
                            <th scope="col"></th>
                            </tr>
                        </thead>
                            <tbody>
                                {this.initializeTable(/**/)}
                            </tbody>
                        </table>
                        <form name="myForm9">
                            <div className="input-group mb-3">
                                <select className="custom-select" id="inputGroupSelect02" name="filter" onChange={this.onChange}>
                                    <option value="All">All</option >
                                    <option value="Not Approved">Not Approved</option >
                                    <option value="Approved">Approved</option >

                                </select>
                                <div className="input-group-append">
                                    <label className="input-group-text" htmlFor="inputGroupSelect02"> Switching Shifts Filter </label>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
        )
    }
}

export default Switch