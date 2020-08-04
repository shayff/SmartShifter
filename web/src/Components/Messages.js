import React, { Component } from 'react'
import { getMessages,ListOfEmployees,sendMessage } from './UserFunctions'
import { withRouter } from 'react-router-dom'

class Messages extends Component {
    constructor() {
        super()
        this.state = { messages: [],
            arrEmployees:[],
            textMessage:'',
            toWhoToSend:['All'],
            title:[],
            attached:[]
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
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
          return this.state.arrEmployees.map((employee,index) => (
          <option key={index + 1} value= {employee["_id"]} >{employee["first name"]} {employee["last name"]}</option>
          ));
    }

    validateMessage() {
        const title = document.forms["myForm7"]["title"].value;
        const message = document.forms["myForm7"]["textMessage"].value;
       // const attached = document.forms["myForm6"]["attached"].value;
        let validate = true;

        /*|| attached === ""*/
        if (title === "" || message === "")
         {
          alert("All Fields Must Be Filled");
          validate = false;
        }

        return validate;
      }

      onSubmit (e) {
        e.preventDefault()

        let who=[];
        if(this.state.toWhoToSend[0] ==='All')
        {
            for(let i=0; i<this.state.arrEmployees.length; i++)
            {
                who.push(parseInt(this.state.arrEmployees[i]["_id"]))
            }
        }
        else
        {
            who.push(parseInt(this.state.toWhoToSend));
        }

        const meesage = {
            toWho: who,
            title: this.state.title,
            textMessage: this.state.textMessage,
            attached: this.state.attached,
        }

        console.log(meesage)
        if(this.validateMessage()) {
            sendMessage(meesage).then(res => {
            this.props.history.push(`/meesages`)
           })
        }
    }

    componentDidMount ()
     {
        getMessages().then(userMessages =>{
            if (userMessages)
            {
               this.setState({messages: userMessages});
            }
        });  
        ListOfEmployees().then(employees =>{ 
            if (employees)
            {
                this.setState({arrEmployees: employees});
            }
         });
    }

    render () {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Messages</h1>
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
                    <select className="custom-select" id="inputGroupSelect02" name="toWhoToSend" onChange={this.onChange}>
                        <option value="All">All</option >
                        {this.initializeOptions()}
                    </select>
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">Choose To Who To Send</label>
                    </div>
                    </div>
                    <div className="form-group">
                    <label htmlFor="titleComment" >Write Here The Message</label>
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