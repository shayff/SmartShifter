import React, { Component } from 'react'
import { getSentMessages,listOfEmployees,sendMessage,getShifts, getSettings} from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'
import moment from 'moment'

class Messages extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { 
            title:'',
            textMessage:'',
            messages: [],
            arrEmployees:[],
            daysViewOptions: [],
            shiftsViewOptions: [],
            employeeViewOptions: [],
            jobsViewOptions: [],
            daysToSend:[],
            shiftsToSend:[],
            employeeToSend:[],
            jobsToSend:[],
            filterViewOptions: [{key:'All' ,value: 'All'}],
            recipientFilter: [{key:'All' ,value: 'All'}],
            isFilterAllChosen: true,
            isDaysOptionAllChosen: false,
            isShiftOptionAllChosen: false,
            isEmployeeOptionAllChosen: false,
            isJobsOptionAllChosen: false,
            shiftsOptions:[],
            daysOptions:[],
            jobsOptions:[],
            minDate: moment().day(0).format('YYYY-MM-DD'),
            maxDate: moment().day(13).format('YYYY-MM-DD')
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSelectOrRemoveDays = this.onSelectOrRemoveDays.bind(this)
        this.onSelectOrRemoveShifts = this.onSelectOrRemoveShifts.bind(this)
        this.onSelectOrRemoveEmployees = this.onSelectOrRemoveEmployees.bind(this)
        this.onSelectOrRemoveJobs = this.onSelectOrRemoveJobs.bind(this)
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
                newFilter.push(parseInt(this.state.arrEmployees[i]["_id"]))
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                newFilter.push(parseInt(selectedList[i].key))
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({recipientFilter: newFilter,
                       filterViewOptions: showView,
                       isFilterAllChosen: isAllChosen}, () => this.initializeTable(this.state.messages,this.state.recipientFilter));
    }

    filterMessages(messages,optionsFilter)
    {
        let messagesFilterd = [];
        messagesFilterd = messages.filter((message) => { 
            for(let i=0 ; i<optionsFilter.length; i++)
            {
                for(let j=0 ; j<message["to"].length; j++)
                {
                    if((message["to"][j])['_id'] === optionsFilter[i])
                    {
                        return true;
                    }
                }
            }

            return false;
        });

        return messagesFilterd;
    }

    onSelectOrRemoveDays(selectedList) {
        let days=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.daysOptions.length; i++)
            {
                days.push(this.state.daysOptions[i])
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                days.push(selectedList[i].value)
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({daysToSend: days,
                       isDaysOptionAllChosen: isAllChosen,
                       daysViewOptions: showView});
    }

    onSelectOrRemoveShifts(selectedList) {
        let shifts=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            const shiftsOptions = this.state.shiftsOptions;
            const minDate = this.state.minDate;
            const maxDate = this.state.maxDate;
            let j = 0;
            let startDate = minDate;
    
            while(startDate <= maxDate)
            {
                if(shiftsOptions[startDate])
                {
                    for(let i=0; i<shiftsOptions[startDate].length; i++)
                    {
                        shifts.push(parseInt((shiftsOptions[startDate][i])["id"]))
                    }
                }
                
                j++;
                startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
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

    onSelectOrRemoveJobs(selectedList) {
        let jobs=[];
        let isAllChosen;
        let showView;

        if(this.isAllOptionInArray(selectedList))
        {
            for(let i=0; i<this.state.jobsOptions.length; i++)
            {
                jobs.push(this.state.jobsOptions[i])
            }

            isAllChosen = true;
            showView = [{key:'All' ,value: 'All'}];
        }
        else
        {
            for(let i=0; i<selectedList.length; i++)
            {
                jobs.push(selectedList[i].value)
            }

            isAllChosen = false;
            showView = selectedList;
        }
        
        this.setState({jobsToSend: jobs,
                       isJobsOptionAllChosen: isAllChosen,
                       jobsViewOptions: showView});
    }

    whoRead(recipients)
    {
        return recipients.map((recipient,index) =>
        {
            if(recipient.is_read)
            {
                return( <div key={index}  style={{display: 'inline-flex'}}>
                    <div style={{color:'green',marginRight:'5px'}}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-all" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                    </svg></div> {recipient.full_name + ', '}</div>
                )
            }
            else
            {
                return( <div key={index} style={{display: 'inline-flex'}}>
                    <div style={{color:'red',marginRight:'2px'}}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg></div> {recipient.full_name + ', '} </div>
                )
            }
        })        
    }

    initializeTable = (userMessages,optionsFilter) => {
        if(userMessages)
        {
            let userMessagesFilterd;

            if(this.isAllOptionInArray(optionsFilter))
            {
                userMessagesFilterd = userMessages;
            }
            else
            {
                userMessagesFilterd = this.filterMessages(userMessages,optionsFilter);
            }

            return userMessagesFilterd.map((messages,index) => (
                <tr key = {index} >
                <th scope="row" className="text-center"> {index + 1}</th>
                <td className="text-center">{this.whoRead(messages["to"])}</td>
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
        let shiftsOptions = [{key:'All' ,value: 'All'}];

        while(startDate <= maxDate)
        {
            if(shifts[startDate])
            {
                for(let i=0; i<shifts[startDate].length; i++)
                {
                    shiftsOptions.push({key:(shifts[startDate][i])["id"] ,value: (shifts[startDate][i]).name + ' ' + 
                        (shifts[startDate][i])["start_time"] + '-' + (shifts[startDate][i])["end_time"], cat: (shifts[startDate][i]).date})
                }
            }
            
            j++;
            startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }

        return shiftsOptions;
    }
    
    initializeEmployeeOptions = () => { 
        let employeeOptions = [{key:'All' ,value: 'All'}]
        this.state.arrEmployees.map((employee) => (
        employeeOptions.push({key:employee["_id"] ,value: employee["first_name"] + ' ' + employee["last_name"] ,cat: employee["job_type"]})
        ));
        return employeeOptions;
    }

    validateMessage() {
        const title = document.forms["myForm7"]["title"].value;
        const message = document.forms["myForm7"]["textMessage"].value;
        const employeeToSend = this.state.employeeToSend.length;
        const shiftsToSend = this.state.shiftsToSend.length;
        const daysToSend = this.state.daysToSend.length;
        const jobsToSend = this.state.jobsToSend.length;
        let validate = true;

        if (title === "" || message === "" || (employeeToSend === 0 && shiftsToSend === 0 && jobsToSend === 0 && daysToSend === 0))
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
    }

    getDaysOptions()
    {
        const minDate = this.state.minDate;
        const middleDate = moment(minDate, "YYYY-MM-DD").add(7, 'days').format('YYYY-MM-DD');
        const maxDate = this.state.maxDate;
        let daysOptions = [{key:'All' ,value: 'All'}];
        let j = 0;
        let startDate = minDate;

        while(startDate <= maxDate)
        {
            if(startDate < middleDate)
            {
                daysOptions.push({key: startDate, value: startDate, cat: "Current Week"})       
            }
            else
            {
                daysOptions.push({key: startDate, value: startDate, cat: "Next Week"})       
            }

            j++;
            startDate = moment(minDate, "YYYY-MM-DD").add(j, 'days').format('YYYY-MM-DD');
        }

        if (this._isMounted)
        {
            this.setState({ daysOptions: daysOptions});
        }
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

    getJobsOptions = () => { 
        let jobsOptions = [{key:'All' ,value: 'All'}];

        getSettings().then(data => {
            if(data)
            {   
                data["roles"].map((jobType,index) => (
                    jobsOptions.push({key:index ,value: jobType})));
            }
        });

        if (this._isMounted)
        {
            this.setState({jobsOptions: jobsOptions});
        }
    }

    getDefualtData()
    {
        const detail = this.props.location.state.detail;
        
        if(this.props.location.state.from === "Employees")
        {
            this.setState({employeeToSend: [detail["_id"]],    
                        employeeViewOptions: [{key:detail["_id"] ,value: detail["first_name"] + ' ' + detail["last_name"] ,cat: detail["job_type"]}],
                        isEmployeeOptionAllChosen: false});
        }
        else
        {
            this.setState({shiftsToSend: [detail["id"]],    
                           shiftsViewOptions: [{key:detail["id"] ,value: detail.name + ' ' + detail["start_time"] + '-' + detail["end_time"], cat: detail.date}],
                           isShiftOptionAllChosen: false});
        }
    }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount ()
     {
        this._isMounted = true;

        this.getShiftsOptions();
        this.getDaysOptions();
        this.getJobsOptions();
        if(this.props.location.state)
        {
            this.getDefualtData()
        }
        
        getSentMessages().then(userMessages => {
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
        
        listOfEmployees().then(employees =>{
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

        const message = {
            toWho: 
            {
                employees: this.state.employeeToSend,
                shifts: this.state.shiftsToSend,
                dates:this.state.daysToSend,
                job_type:this.state.jobsToSend
            },
            title: this.state.title,
            textMessage: this.state.textMessage,
        }

        if(this.validateMessage()) {
            sendMessage(message).then(res => {
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
                    <div style = {{overflowY: 'auto', maxHeight:"440px"}}>
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                <th scope="col" className="text-center">#</th>
                                <th scope="col" className="text-center">To</th>
                                <th scope="col" className="text-center">Title</th>
                                <th scope="col" className="text-center">The Message</th>
                                <th scope="col" className="text-center">Time Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.initializeTable(this.state.messages,this.state.recipientFilter)}  
                            </tbody>
                            </table>
                        </div>
                        <div>
                            <label htmlFor="recipient_filter"> Filter By Recipient </label>   
                            <Multiselect
                            id='recipientFilter'
                            options= {this.initializeEmployeeOptions()}
                            style={{searchBox: {background: 'white'}}}
                            selectedValues={this.state.filterViewOptions}
                            selectionLimit={this.state.isFilterAllChosen === true ? '1' : null}
                            displayValue="value"
                            groupBy="cat"
                            closeIcon="cancel"
                            placeholder="Choose Recipient"
                            avoidHighlightFirstOption= {true}
                            hidePlaceholder={true}
                            onSelect={this.onSelectOrRemoveFilter}
                            onRemove={this.onSelectOrRemoveFilter}/>
                        </div><br/>
                        <div style={{color:'red',float:'left'}}>
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <label style={{marginLeft:"10px"}}>An Employee Who Not Confirmed The Reading Of The Message </label><br/>
                        <div style={{color:'green',float:'left'}}>
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-check-all" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                            </svg>
                        </div>
                        <label style={{marginLeft:"10px"}}>An Employee Who Confirmed The Reading Of The Message </label><br/>
                    </div>
                <form name="myForm7" onSubmit={this.onSubmit}>
                    <div className="input-group mb-3">
                        <label htmlFor="days_to_send">Choose Day To Send</label>   
                        <Multiselect
                        id='daysToSend'
                        options= {this.state.daysOptions}
                        selectedValues={this.state.daysViewOptions}
                        selectionLimit={this.state.isDaysOptionAllChosen === true ? '1' : null}
                        style={{searchBox: {background: 'white'}}}
                        displayValue="value"
                        closeIcon="cancel"
                        placeholder="Choose Days"
                        avoidHighlightFirstOption= {true}
                        groupBy="cat"
                        hidePlaceholder={true}
                        onSelect={this.onSelectOrRemoveDays}
                        onRemove={this.onSelectOrRemoveDays}/>
                    </div>
                    <div className="input-group mb-3">
                        <label htmlFor="shifts_to_send">Choose Shift To Send</label>   
                        <Multiselect
                        id='shiftsToSend'
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
                        <label htmlFor="employees_to_send">Choose Employee To Send</label>   
                        <Multiselect
                        id='employeesToSend'
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
                    <div className="input-group mb-3">
                        <label htmlFor="jobs_to_send">Choose Job To Send</label>   
                        <Multiselect
                        id='jobsToSend'
                        options= {this.state.jobsOptions}
                        selectedValues={this.state.jobsViewOptions}
                        selectionLimit={this.state.isJobsOptionAllChosen === true ? '1' : null}
                        style={{searchBox: {background: 'white'}}}
                        displayValue="value"
                        closeIcon="cancel"
                        placeholder="Choose Jobs"
                        avoidHighlightFirstOption= {true}
                        hidePlaceholder={true}
                        onSelect={this.onSelectOrRemoveJobs}
                        onRemove={this.onSelectOrRemoveJobs}/>
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