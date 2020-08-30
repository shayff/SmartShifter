import React, { Component } from 'react'
import { getSentMessages, listOfEmployees } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'

class SentMessages extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { 
            messages: [],
            arrEmployees:[],
            filterViewOptions: [{key:'All' ,value: 'All'}],
            textMessage:'',
            title:'',
            recipientFilter: [],
            isFilterAllChosen: true,
        }

        this.onSelectOrRemoveFilter = this.onSelectOrRemoveFilter.bind(this)
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
                if(message["name_sender"].indexOf(optionsFilter[i])>-1)
                {
                    return true;
                }
            }

            return false;
        });

        return messagesFilterd;
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

    initializeEmployeeOptions = () => { 
        let options = [{key:'All' ,value: 'All'}]
        this.state.arrEmployees.map((employee) => (
        options.push({key:employee["_id"] ,value: employee["first name"] + ' ' + employee["last name"] ,cat: employee["job type"]})
        ));
        return options;
    }
    
    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount ()
     {
        this._isMounted = true;

        getSentMessages().then(userMessages =>{
            if (userMessages && userMessages.length !== 0)
            {
                console.log(userMessages)
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
    
    render () {
        return (
            <div className="container" style={{marginBottom: '30px'}}>
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            {<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-chat-text-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
                            </svg>}  My Messages
                    </h1>
                    </div>
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
                        </div>
                </div>
            </div>
        )
    }
}

export default withRouter(SentMessages)