# SmartShifter
![logo](/documentation/images/logo.png)
    

  
Smart Shifter is an automatic shift scheduler and shift managment system including a mobile app and web app. 

## Installation

### Clone

Clone this repo to your local machine using https://github.com/shayff/SmartShifter


### Setup

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install SmartShifter server.
```bash
cd server
pip install requirements.txt
```

Use the package manager npm to install the web app.
```bash
cd web
npm install
```

## Documentation

### Web API Services 

#### MemberService


|     Name              | Description                                   | URL                                 | Request Methods | 
| --------------------- | --------------------------------------------- | ----------------------------------- | --------------- |
| Login                 | allow user to login and get jwt token         | 127.0.0.1:5000/api/v1/login         | POST            | 
| Register              | create new user                               | 127.0.0.1:5000/api/v1/user          | POST            |  
| Logout                | allow user to logout                          | 127.0.0.1:5000/api/v1/logout        | POST            | 
| Profile               | return the profile details of logged in user  | 127.0.0.1:5000/api/v1/user/profile  | GET             | 
| Change Password       | let user to change their password             | 127.0.0.1:5000/api/v1/user/password | PUT             | 
| Update User           | let user to update their details              | 127.0.0.1:5000/api/v1/user          | PUT             | 
| Send Message          | send messages to user(s)                      | 127.0.0.1:5000/api/v1/message       | POST            | 
| Get Messages          | return the user messages                      | 127.0.0.1:5000/api/v1/messages      | GET             | 
| Get Sent Messages     | return the messages the user sent             | 127.0.0.1:5000/api/v1/messages/sent | GET             | 
| Update Message status | update the status of the message              | 127.0.0.1:5000/api/v1/message/status| PUT             | 


## License
This project is licensed under the MIT License 
