import React, { Component } from 'react'
import { getMessages,ListOfEmployees,sendMessage } from './UserFunctions'
import { withRouter } from 'react-router-dom'
import { Multiselect } from 'multiselect-react-dropdown'

class Messages extends Component {
    _isMounted = false;

    constructor() {
        super()
        this.state = { messages: [],
            arrEmployees:[],
            textMessage:'',
            toWhoToSend:[],
            title:[],
            attached:[]
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSelectOrRemoveEmployees = this.onSelectOrRemoveEmployees.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSelectOrRemoveEmployees(selectedList) {
        this.setState({toWhoToSend: selectedList});
    }

    initializeTable = (userMessages) => {
        if(userMessages)
        {
         return userMessages.map((messages,index) => (
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
    
    initializeOptions = () => { 
        let options = [{key:'All' ,value: 'All'}]
        this.state.arrEmployees.map((employee) => (
        options.push({key:employee["_id"] ,value: employee["first name"] + ' ' + employee["last name"] ,cat: employee["job type"]})
        ));
        return options;
    }

    validateMessage() {
        const title = document.forms["myForm7"]["title"].value;
        const message = document.forms["myForm7"]["textMessage"].value;
        const toWhoToSend = this.state.toWhoToSend.length;
       // const attached = document.forms["myForm6"]["attached"].value;
        let validate = true;

        /*|| attached === ""*/
        if (title === "" || message === "" || toWhoToSend === 0)
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
      }

    componentWillUnmount() 
    {
        this._isMounted = false;
    }

    componentDidMount ()
     {
        this._isMounted = true;

        getMessages().then(userMessages =>{
            if (userMessages)
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

        let who=[];
        if(this.state.toWhoToSend[0].key === 'All')
        {
            for(let i=0; i<this.state.arrEmployees.length; i++)
            {
                who.push(parseInt(this.state.arrEmployees[i]["_id"]))
            }
        }
        else
        {
            for(let i=0; i<this.state.toWhoToSend.length; i++)
            {
                who.push(parseInt(this.state.toWhoToSend[i].key))
            }
        }

        const meesage = {
            toWho: who,
            title: this.state.title,
            textMessage: this.state.textMessage,
            attached: this.state.attached,
        }
        
        if(this.validateMessage()) {
            sendMessage(meesage).then(res => {
            this.props.history.push(`/meesages`)
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
                </div>
                <form name="myForm7">
                    <div className="input-group mb-3">
                    <label htmlFor="employees_for_shift">Choose To Who To Send</label>   
                    <Multiselect
                    options= {this.initializeOptions()}
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