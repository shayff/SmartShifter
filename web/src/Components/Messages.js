import React, { Component } from 'react'
import { getMessages,ListOfEmployees,sendMessage,getShifts } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'
import moment from 'moment'

class Messages extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { 
            messages: [],
            arrEmployees:[],
            filterViewOptions: [],
            shiftsViewOptions: [],
            employeeViewOptions: [],
            textMessage:'',
            shiftsToSend:[],
            employeeToSend:[],
            title:'',
            senderFilter: [],
            attached:[],
            isShiftOptionAllChosen: false,
            isFilterAllChosen: false,
            isEmployeeOptionAllChosen: false,
            shiftsOptions:[],
            minDate: moment().day(0).format('YYYY-MM-DD'),
            maxDate: moment().day(13).format('YYYY-MM-DD')
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSelectOrRemoveEmployees = this.onSelectOrRemoveEmployees.bind(this)
        this.onSelectOrRemoveShifts = this.onSelectOrRemoveShifts.bind(this)
        this.onSelectOrRemoveFilter = this.onSelectOrRemoveFilter.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    isAllOptionInArray(array)
    {
        for(let i = 0; i<array.length; i++)
        {
            if(array[i].key === 'All')
            {
                return true;
            }
        }

        return false
    }

    onSelectOrRemoveFilter(selectedList) 
    {
        let newFilter=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.arrEmployees.length; i++)
            {
                newFilter.push(parseInt(this.state.arrEmployees[i]["First Name"]))
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                newFilter.push(parseInt(selectedList[i].value))
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({senderFilter: newFilter,
                       filterViewOptions: showView,
                       isFilterAllChosen: isAllChosen}, () => this.initializeTable(this.state.messages,this.state.senderFilter));
    }

    filterMessages(messages,optionsFilter)
    {
        let messagesFilterd = [];
        messagesFilterd = messages.filter((message) => { 
            for(let i=0 ; i<optionsFilter.length; i++)
            {
                if(messages["name_sender"].indexOf(optionsFilter[i])>-1)
                {
                    return true;
                }
            }

            return false;
        });

        return messagesFilterd;
    }

    onSelectOrRemoveShifts(selectedList) {
        let shifts=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.shiftsOptions.length; i++)
            {
                shifts.push(parseInt(this.state.shiftsOptions[i]["_id"]))
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                shifts.push(parseInt(selectedList[i].key))
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({shiftsToSend: shifts,
                       isShiftOptionAllChosen: isAllChosen,
                       shiftsViewOptions: showView});
    }

    onSelectOrRemoveEmployees(selectedList) {
        let who=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.arrEmployees.length; i++)
            {
                who.push(parseInt(this.state.arrEmployees[i]["_id"]))
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                who.push(parseInt(selectedList[i].key))
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({employeeToSend: who,
                       isEmployeeOptionAllChosen: isAllChosen,
                       employeeViewOptions: showView});
    }

    initializeTable = (userMessages,optionsFilter) => {
        if(userMessages)
        {
            let userMessagesFilterd = this.filterMessages(userMessages,optionsFilter);

            return userMessagesFilterd.map((messages,index) => (
                <tr key = {index} >
                <th scope="row" className="text-center"> {index + 1}</th>
                <td className="text-center">{messages["name_sender"]}</td>
                <td className="text-center">{messages["title"]}</td>
                <td className="text-center">{messages["message"]}</td>
                <td className="text-center">{messages["time_created"]}</td>
                </tr>
         ));
        }
    }

    initializeShiftsOptions = () => { 
        const shifts = this.state.shiftsOptions;
        const minDate = this.state.minDate;
        const maxDate = this.state.maxDate;
        let j = 0;
        let startDate = minDate;
        let options = [{key:'All' ,value: 'All'}];

        while(startDate <= maxDate)
        {
            if(shifts[startDate])
            {
                for(let i=0; i<shifts[startDate].length; i++)
                {
                    options.push({key:(shifts[startDate][i])["id"] ,value: (shifts[startDate][i]).name + ' ' + 
                        (shifts[startDate][i])["start time"] + '-' + (shifts[startDate][i])["end time"], cat: (shifts[startDate][i]).date})
                }
            }
            
            j++;
            startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }

        return options;
    }
    
    initializeEmployeeOptions = () => { 
        let options = [{key:'All' ,value: 'All'}]
        this.state.arrEmployees.map((employee) => (
        options.push({key:employee["_id"] ,value: employee["first name"] + ' ' + employee["last name"] ,cat: employee["job type"]})
        ));
        return options;
    }

    validateMessage() {
        const title = document.forms["myForm7"]["title"].value;
        const message = document.forms["myForm7"]["textMessage"].value;
        const employeeToSend = this.state.employeeToSend.length;
        const shiftsToSend = this.state.shiftsToSend.length;
       // const attached = document.forms["myForm6"]["attached"].value;
        let validate = true;

        /*|| attached === ""*/
        if (title === "" || message === "" || (employeeToSend === 0 && shiftsToSend === 0))
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
    }

    getShiftsOptions()
    {
        const minDate = this.state.minDate;
        const maxDate = this.state.maxDate;
  
         const shifts ={
             start_date: minDate, 
             end_date: maxDate,
             statuses: ['scheduled'] 
         }
         
         getShifts(shifts).then(shifts =>{
            if(shifts){
                if (this._isMounted)
                {
                    this.setState({ shiftsOptions: shifts});
                }
            }
         })
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount ()
     {
        this._isMounted = true;

        this.getShiftsOptions();

        getMessages().then(userMessages =>{
            if (userMessages && userMessages.length !== 0)
            {
                if (this._isMounted)
                {
                    this.setState({messages: userMessages});
                }
            }
            else
            {
              alert("No Messages To Show")
            }
        });  
        
        ListOfEmployees().then(employees =>{
            if (employees)
            {
                if (this._isMounted)
                {
                    this.setState({arrEmployees: employees});
                }
            }
         });
    }
    
      onSubmit (e) {
        e.preventDefault()

        const meesage = {
            toWho: this.state.employeeToSend,
            //toShfits: this.state.shiftsToSend, ***********************************
            title: this.state.title,
            textMessage: this.state.textMessage,
            attached: this.state.attached,
        }
        
        if(this.validateMessage()) {
            sendMessage(meesage).then(res => {
                window.location.reload(false);
           })
        }
    }


    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-chat-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
                            </svg>} Messages
                    </h1>
                    </div>
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                            <th scope="col" className="text-center">#</th>
                            <th scope="col" className="text-center">The Sender</th>
                            <th scope="col" className="text-center">Title</th>
                            <th scope="col" className="text-center">The Message</th>
                            <th scope="col" className="text-center">Time Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.initializeTable(this.state.messages)}  
                        </tbody>
                        </table>
                        <div>
                            <label htmlFor="sender_filter"> Filter By Sender</label>   
                            <Multiselect
                            id='senderFilter'
                            options= {this.initializeEmployeeOptions()}
                            style={{searchBox: {background: 'white'}}}
                            selectedValues= {[{key:'All' ,value: 'All'}]}
                            displayValue="value"
                            groupBy="cat"
                            closeIcon="cancel"
                            placeholder="Choose Sender"
                            avoidHighlightFirstOption= {true}
                            hidePlaceholder={true}
                            onSelect={this.onSelectOrRemoveFilter}
                            onRemove={this.onSelectOrRemoveFilter}/>
                        </div>
                </div>
                <form name="myForm7" onSubmit={this.onSubmit}>
                <div className="input-group mb-3">
                    <label htmlFor="shifts_to_send">Choose Shift To Send</label>   
                    <Multiselect
                    id='shiftsSend'
                    options= {this.initializeShiftsOptions()}
                    selectedValues={this.state.shiftsViewOptions}
                    selectionLimit={this.state.isShiftOptionAllChosen === true ? '1' : null}
                    style={{searchBox: {background: 'white'}}}
                    displayValue="value"
                    closeIcon="cancel"
                    placeholder="Choose Shifts"
                    avoidHighlightFirstOption= {true}
                    groupBy="cat"
                    hidePlaceholder={true}
                    onSelect={this.onSelectOrRemoveShifts}
                    onRemove={this.onSelectOrRemoveShifts}/>
                    </div>
                    <div className="input-group mb-3">
                    <label htmlFor="employees_to_send">Choose To Who To Send</label>   
                    <Multiselect
                    id='employeeSend'
                    options= {this.initializeEmployeeOptions()}
                    selectedValues={this.state.employeeViewOptions}
                    selectionLimit={this.state.isEmployeeOptionAllChosen === true ? '1' : null}
                    style={{searchBox: {background: 'white'}}}
                    displayValue="value"
                    closeIcon="cancel"
                    placeholder="Choose Employees"
                    avoidHighlightFirstOption= {true}
                    groupBy="cat"
                    hidePlaceholder={true}
                    onSelect={this.onSelectOrRemoveEmployees}
                    onRemove={this.onSelectOrRemoveEmployees}/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="titleComment" >Write Here The Title</label>
                    <input className="form-control" type="text" name="title" id="titleComment" placeholder="Title" onChange={this.onChange} />   
                    <label htmlFor="comment">Write Here The Message</label>
                    <textarea className="form-control" name="textMessage" rows="5" id="comment" placeholder="Message" onChange={this.onChange}></textarea>
                    </div>          
                    <button type="submit" className="btn-lg btn-primary btn-block">
                                    Send Message
                    </button>
                </form>
            </div>
        )
    }
}

export default withRouter(Messages)