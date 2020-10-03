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
| Login                 | Allow user to login and get jwt token         | 127.0.0.1:5000/api/v1/login         | POST            | 
| Register              | Create new user                               | 127.0.0.1:5000/api/v1/user          | POST            |  
| Logout                | Allow user to logout                          | 127.0.0.1:5000/api/v1/logout        | POST            | 
| Profile               | Return the profile details of logged in user  | 127.0.0.1:5000/api/v1/user/profile  | GET             | 
| Change Password       | Let user to change their password             | 127.0.0.1:5000/api/v1/user/password | PUT             | 
| Update User           | Let user to update their details              | 127.0.0.1:5000/api/v1/user          | PUT             | 
| Send Message          | Send messages to user(s)                      | 127.0.0.1:5000/api/v1/message       | POST            | 
| Get Messages          | Return the user messages                      | 127.0.0.1:5000/api/v1/messages      | GET             | 
| Get Sent Messages     | Return the messages the user sent             | 127.0.0.1:5000/api/v1/messages/sent | GET             | 
| Update Message status | Update the status of the message              | 127.0.0.1:5000/api/v1/message/status| PUT             | 



#### CompanyService


|     Name              | Description                                       | URL                                               | Request Methods | 
| --------------------- | ------------------------------------------------- | ------------------------------------------------- | --------------- |
| Create Company        | Create a new company and assign to logged in user | 127.0.0.1:5001/api/v1/company                     | POST            |
| Company Profile       | Return details about the company                  | 127.0.0.1:5001/api/v1/company                     | GET             |
| Update Company        | Update the relevant company details               | 127.0.0.1:5001/api/v1/company                     | PUT             |
| Add employee          | Assign an employee to the company                 | 127.0.0.1:5001/api/v1/company/employee            | POST            |
| Remove employee       | Removing an employee from a company               | 127.0.0.1:5001/api/v1/company/employee            | DELETE          |
| Update Employee       | Update employees details                          | 127.0.0.1:5001/api/v1/company/employee            | PUT             |
| List of employees     | Return a list of employees of company             | 127.0.0.1:5001/api/v1/company/employees           | GET             |
| Manager preference    | Update preference from manager                    | 127.0.0.1:5001/api/v1/company/preference/manager  | POST            |
| Employee preference   | Update the preference the employee filled         | 127.0.0.1:5001/api/v1/company/preference/employee | POST            |
| Get Preferences       | Return the preference the manager set             | 127.0.0.1:5001/api/v1/company/preferences         | GET             |

#### ShiftManagerService

|     Name              | Description                                               | URL                                           | Request Methods | 
| --------------------- | --------------------------------------------------------- | --------------------------------------------- | --------------- |
| Create Shift          | Create a new shift                                        | 127.0.0.1:5002/api/v1/shift                   | POST            |
| Update Shift          | Update shift details                                      | 127.0.0.1:5002/api/v1/shift                   | PUT             |
| Delete Shift          | Delete a shift                                            | 127.0.0.1:5002/api/v1/shift                   | DELETE          |
| Get shifts            | Returns the company's shifts list                         | 127.0.0.1:5002/api/v1/shifts                  | GET             |
| Get Shifts Swaps      | Returns the company's shifts swaps list                   | 127.0.0.1:5002/api/v1/shifts_swaps            | GET             |
| Ask Shift Swap        | Create new shift swap                                     | 127.0.0.1:5002/api/v1/shifts_swaps            | POST            |
| Can Shift Swap        | Other employee can swap the shift                         | 127.0.0.1:5002/api/v1/shifts_swaps/can_swap   | POST            |
| Confirm Shift Swap    | Manager confirm the swap                                  | 127.0.0.1:5002/api/v1/shifts_swaps/confirm    | POST            |
| Build Shift           | Use the build shift algorithm and return a shift schedule | 127.0.0.1:5002/api/v1/shifts/build            | POST            |
| Set Shifts Schedule   | Set a shifts scdeule                                      | 127.0.0.1:5002/api/v1/shifts/set              | POST            |

## License
This project is licensed under the MIT License 
