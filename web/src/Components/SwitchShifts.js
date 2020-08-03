import React, { Component } from 'react'
import { getSwitches,approveSwitches } from './UserFunctions'

class SwitchShifts extends Component {
    constructor() {
        super()
        this.state = { 
            switchData: [],
            filter: ['confirmed','wait_for_swap','wait_for_confirm'],
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange (e) 
    {
        let value = [];
        if(e.target.value==='All')
        {
            value.push('confirmed','wait_for_swap','wait_for_confirm')
        }
        else
        {
            value.push(e.target.value)
        }
        this.setState({ [e.target.name]: value },() => this.getRequestOfSwitches());
    }

    componentDidMount ()
    {
        this.getRequestOfSwitches();
    }

   getRequestOfSwitches()
   {
     getSwitches(this.state.filter).then(requestSwitches =>{
           if (requestSwitches)
           {
              this.setState({switchData: requestSwitches});

              if (requestSwitches.length === 0)
              {
               alert("No Requested Switches For This Filter")
              }
           }       
       });  
   }

    onClickDecision(shiftId,decision) 
    {
        const managerDecision={
            swapId:shiftId,
            status:decision
        }
        
        approveSwitches(managerDecision).then(res => {
            window.location.reload()});
    }

    initializeTable = (data) => {
        if(data.length!== 0)
        {
         return data.map((switchData,index) => (
            <tr key = {index} >
            <th scope="row" className="text-center"> {index +1}</th>
            <td className="text-center">{switchData.shift_details.date} {switchData.shift_details["start time"]}-{switchData.shift_details["end time"]}</td>
            <td className="text-center">{switchData.name_employee_ask}</td>
            {this.getWhoToGetTheShift(switchData)}
            <td className="text-center">{switchData.status}</td>
            <td className="text-center">{switchData.time_created}</td>
            <td>{this.initializeTableApproveButton(switchData)}</td>
            <td>{this.initializeTableDontApproveButtons(switchData)}</td>
            </tr>
         ));
        }
    }

    initializeTableApproveButton(switchData)
    {
        if(switchData.status === 'wait_for_confirm')
        {
            return( 
            <button type="button" className="btn-lg btn-primary btn-block" onClick={() => this.onClickDecision(switchData.id,"confirm")}>
                                Approve Switch
            </button>)
        }
    }
    
    initializeTableDontApproveButtons(switchData)
    {
        if(switchData.status === 'wait_for_confirm')
        {
            return( 
                <button type="button" className="btn-lg btn-primary btn-block" onClick={() => this.onClickDecision(switchData.id,"not_confirm")}>
                        Don't Approve Switch
                </button>)
        }
    }

    isWhoWantToGetTheShiftColumVisible()
    {
        if(this.state.filter[0] === 'wait_for_confirm' || this.state.filter[0] === 'confirmed')
        {
            return(<th scope="col" className="text-center">The One Who Want To Get The Shift</th>)
        }
    }

    getWhoToGetTheShift(switchData)
    {
        if(this.state.filter[0] === 'wait_for_confirm' || this.state.filter[0] === 'confirmed')
        {
            return <td className="text-center">{switchData.name_employee_can}</td>; 
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
                            <th scope="col" className="text-center">#</th>
                            <th scope="col"className="text-center">The Shift</th>
                            <th scope="col"className="text-center">The One Who Want To Switch The Shift</th>
                            {this.isWhoWantToGetTheShiftColumVisible()}
                            <th scope="col" className="text-center">Status Of The Request</th>
                            <th scope="col" className="text-center">Time Of The Request</th>
                            <th scope="col" className="text-center"></th>
                            <th scope="col" className="text-center"></th>
                            </tr>
                        </thead>
                            <tbody>
                                {this.initializeTable(this.state.switchData)}
                            </tbody>
                        </table>
                        <form name="myForm9">
                            <div className="input-group mb-3">
                                <select className="custom-select" id="inputGroupSelect02" name="filter" onChange={this.onChange}>
                                    <option value="All">All</option >
                                    <option value="wait_for_swap">Wait For Swap</option >
                                    <option value="wait_for_confirm">Wait For Confirm</option >
                                    <option value="confirmed">Confirmed</option >
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

export default SwitchShifts