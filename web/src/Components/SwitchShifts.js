import React, { Component } from 'react'
import { getSwitches,approveSwitches,deleteSwitch } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class SwitchShifts extends Component {
    _isMounted = false;

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

        if(this._isMounted)
        {
            this.setState({ [e.target.name]: value },() => this.getRequestOfSwitches());
        }
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount ()
    {
        this._isMounted = true;

        this.getRequestOfSwitches();
    }

   getRequestOfSwitches()
   {
     getSwitches(this.state.filter).then(requestSwitches =>{
           if (requestSwitches)
           {
                if (requestSwitches.length === 0)
                {
                    alert("No Requested Switches For This Filter")

                }
                if(this._isMounted)
                {
                    this.setState({switchData: requestSwitches});
                }
           }       
       });  
   }

   parseSatuts(status)
   {
        let parsedStatus;
        switch(status)
        {
            case 'confirmed':
            parsedStatus = 'Confirmed';
            break;
            case 'wait_for_swap':
            parsedStatus = 'Wait For Swap';
            break;
            case 'wait_for_confirm':
            parsedStatus = 'Wait For Confirmation';
            break;
            default:
            parsedStatus = '';
            break;
        }

        return parsedStatus;
   }

   onClickDelete(swapId)
   {
        deleteSwitch(swapId).then(res => {
            window.location.reload()});
   }

    onClickDecision(swapId,decision) 
    {
        const managerDecision={
            swapId:swapId,
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
            <td className="text-center">{switchData.shift_details.date} {switchData.shift_details["start_time"]}-{switchData.shift_details["end_time"]}</td>
            <td className="text-center">{switchData.name_employee_ask}</td>
            {this.getWhoToGetTheShift(switchData)}
            <td className="text-center">{this.parseSatuts(switchData.status)}</td>
            <td className="text-center">{switchData.time_created}</td>
            <td>{this.initializeTableApproveButton(switchData)}</td>
            <td>{this.initializeTableDontApproveButtons(switchData)}</td>
            <td>{this.initializeTableDeleteButton(switchData)}</td>
            </tr>
         ));
        }
    }

    initializeTableDeleteButton(switchData)
    {
        if(switchData.status !== 'confirm')
        {
            return( 
            <button type="button" className="btn-lg btn-primary btn-block" onClick={() => this.onClickDelete(switchData.id)}>
                        Delete Switch
            </button>)
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
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5" style={{display: 'inline-block' , marginLeft: '-10%'}}>
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            {<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrows-angle-contract" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M9.5 2.036a.5.5 0 0 1 .5.5v3.5h3.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd" d="M14.354 1.646a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 1 1-.708-.708l4.5-4.5a.5.5 0 0 1 .708 0zm-7.5 7.5a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708-.708l4.5-4.5a.5.5 0 0 1 .708 0z"/>
                    <path fillRule="evenodd" d="M2.036 9.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V10h-3.5a.5.5 0 0 1-.5-.5z"/>
                </svg>} Switching Shifts </h1>
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

export default withRouter(SwitchShifts)