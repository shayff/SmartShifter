import axios from 'axios'
import moment from 'moment'

export const register = newUser => {
    return axios
        .post("/api/v1/user", {
            "first_name": newUser.first_name,
            "last_name": newUser.last_name,
            "email": newUser.email,
            "password": newUser.password,
            "id_number": newUser.id_number,
            "phone": newUser.phone,
            "address": newUser.address,
            "date_of_birth": newUser.date_of_birth,
            "gender": newUser.gender
        })
        .then(response => {
            localStorage.setItem('isManagerOfCompany', 'false')
            return response.data
             })
        .catch(error => {
                console.log(error)
                return error.response.data
        })
}

export const createCompany = data => {
    return axios
        .post("http://localhost:5001/api/v1/company",{
            "company_name": data.company_name,
            "roles": data.companyJobTypes,
            "settings": data.settings,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            localStorage.setItem('isManagerOfCompany', 'true')
            return response.data
        })
        .catch(error => {
            console.log(error)
            return error.response.data
        })
}

export const login = user => {
    return axios
        .post("/api/v1/login", {
            "email": user.email,
            "password": user.password
        })
        .then(response => {
            console.log("Logged In")
            localStorage.setItem('usertoken', response.data.data.token)
            localStorage.setItem('isManagerOfCompany', response.data.data.isManagerOfCompany)
            return response.data.data
        })
        .catch(eror => {
            console.group("error")
            console.log(eror)
        })
}

export const getProfile = () => {
    return axios
    .get("/api/v1/user/profile",
    {
        headers: {
            Authorization: "Bearer " + localStorage.usertoken
         }
    })
    .then(response => {
        return response.data.data;
    })
    .catch(eror => {
        console.log(eror)
    })
}

export const updateProfile = user => {
    return axios
        .put("/api/v1/user/profile", {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email, 
            "id_number": user.id_number,
            "phone": user.phone,
            "address": user.address,
            "date_of_birth": user.date_of_birth,
            "gender": user.gender
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Updated Profile")
             }, (error) => {
                console.log(error)
        })
}

export const updatePassword = user => {
    return axios
        .put("/api/v1/user/password", {
            "current_password": user.currPassword,
             "new_password": user.newPassword
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            return response.data.ok;
             }, (error) => {
                console.log(error)
        })
}

export const sendMessage = message => {
    return axios
        .post("/api/v1/message",{
        "to":message.toWho,
        "title":message.title,
        "message":message.textMessage
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Message Sent")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSentMessages= () => {
    return axios
        .get("/api/v1/messages/sent",
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSettings = () => {
    return axios
    .get("http://localhost:5001/api/v1/company",
    {
        headers: {
            Authorization: "Bearer " + localStorage.usertoken
         }
    })
    .then(response => {
        return response.data.data;
    })
    .catch(eror => {
        console.log(eror)
    })
}

export const updateSettings= data => {
    return axios
        .put("http://localhost:5001/api/v1/company", {
            "company_name": data.company_name,
            "roles": data.companyJobTypes,
            "settings": data.settings,
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Settings Updated")
             }, (error) => {
                console.log(error)
        })
}

export const addEmployee = user => {
    return axios
        .post("http://localhost:5001/api/v1/company/employee", {
            "email": user.email, 
            "time_of_joining": moment().format(),
            "job_type": user.job_type,
            "rank": parseInt(user.rank)
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Add Employee")
             }, (error) => {
                console.log(error)
        })
}

export const removeEmployee = user => {
    return axios
        .delete("http://localhost:5001/api/v1/company/employee", {
            "employees": [user["_id"]],
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Removed Employee")
             }, (error) => {
                console.log(error)
        })
}

export const updateEmployeeInfo = user => {
    return axios
        .put("http://localhost:5001/api/v1/company/employee", {
            "id": parseInt(user.id),
            "job_type": user.job_type,
            "rank": parseInt(user.rank),
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Update Employee")
             }, (error) => {
                console.log(error)
        })
}

export const listOfEmployees = () => {
    return axios
        .get("http://localhost:5001/api/v1/company/employees",
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getShifts = date => {
    return axios
        .get("http://localhost:5002/api/v1/shifts",{ 
                "start_date": date.start_date, 
                "end_date": date.end_date,
                "statuses": date.statuses
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const approveSwitches = data => {
    return axios
        .post("http://localhost:5002/api/v1/shifts_swaps/confirm",{
        "swap_id": data.swapId,
        "status": data.status
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSwitches = data => {
    return axios
        .get("http://localhost:5002/api/v1/shifts_swaps",{
            "statuses":data
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const submitWantedShift = data => {
    return axios
        .post("http://localhost:5001/api/v1/company/preference/manager",{
            "sunday":data.sunday,
            "monday":data.monday,
            "tuesday":data.tuesday,
            "wednesday":data.wednesday,
            "thursday":data.thursday,
            "friday":data.friday,
            "saturday":data.saturday
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Submitted Shifts")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const addShifts = data => {
    return axios
        .post("http://localhost:5002/api/v1/shift",{
            "name": data.shift_name, 
            "start_time": data.start_time,
            "end_time":data.end_time,
            "job_type":data.job_type,
            "difficulty":data.difficulty,
            "date":data.date,
            "amount":data.amount_of_employees,
            "day_part":data.day_part,
            "employees":data.employees_for_shift,
            "note":data.shift_note
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Added Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const updateShift = data => {
    return axios
        .put("http://localhost:5002/api/v1/shift",{
            "id": data.id, 
            "name": data.name, 
            "start_time": data.start_time,
            "end_time":data.end_time,
            "job_type":data.job_type,
            "difficulty":data.difficulty,
            "date":data.date,
            "amount":data.amount,
            "day_part":data.day_part,
            "employees":data.employees,
            "note":data.note,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Updated Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const removeShift = id => {
    return axios
        .delete("http://localhost:5002/api/v1/shift/<shift_id>",{
            "id": id, 
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Removed Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const buildShifts = data => {
    return axios
        .post("http://localhost:5002/api/v1/shifts/build",{
            "start_date": data.startDate, 
            "end_date": data.endDate
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Build Shifts")
            return response.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const acceptBuildShift = data => {
    return axios
        .post("http://localhost:5002/api/v1/shifts/set",{
            data
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Accepted Build Shifts")
            return response.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

/*

import axios from 'axios'
import moment from 'moment'

export const register = newUser => {
    return axios
        .post("/register", {
            "first_name": newUser.first_name,
            "last_name": newUser.last_name,
            "email": newUser.email,
            "password": newUser.password,
            "id_number": newUser.id_number,
            "phone": newUser.phone,
            "address": newUser.address,
            "date_of_birth": newUser.date_of_birth,
            "gender": newUser.gender
        })
        .then(response => {
            localStorage.setItem('isManagerOfCompany', 'false')
            return response.data
             })
        .catch(error => {
                console.log(error)
                return error.response.data
        })
}

export const createCompany = data => {
    return axios
        .post("http://localhost:5001/companies/create",{
            "company_name": data.company_name,
            "roles": data.companyJobTypes,
            "settings": data.settings,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            localStorage.setItem('isManagerOfCompany', 'true')
            return response.data
        })
        .catch(error => {
            console.log(error)
            return error.response.data
        })
}

export const login = user => {
    return axios
        .post("/login", {
            "email": user.email,
            "password": user.password
        })
        .then(response => {
            console.log("Logged In")
            localStorage.setItem('usertoken', response.data.data.token)
            localStorage.setItem('isManagerOfCompany', response.data.data.isManagerOfCompany)
            return response.data.data
        })
        .catch(eror => {
            console.group("error")
            console.log(eror)
        })
}

export const getProfile = () => {
    return axios
    .get("/profile",
    {
        headers: {
            Authorization: "Bearer " + localStorage.usertoken
         }
    })
    .then(response => {
        return response.data.data;
    })
    .catch(eror => {
        console.log(eror)
    })
}

export const updateProfile = user => {
    return axios
        .post("/updateprofile", {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email, 
            "id_number": user.id_number,
            "phone": user.phone,
            "address": user.address,
            "date_of_birth": user.date_of_birth,
            "gender": user.gender
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Updated Profile")
             }, (error) => {
                console.log(error)
        })
}

export const updatePassword = user => {
    return axios
        .post("/changepassword", {
            "current_password": user.currPassword,
             "new_password": user.newPassword
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            return response.data.ok;
             }, (error) => {
                console.log(error)
        })
}

export const sendMessage = message => {
    return axios
        .post("/sendmessage",{
        "to":message.toWho,
        "title":message.title,
        "message":message.textMessage
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Message Sent")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSentMessages= () => {
    return axios
        .get("/api/v1/messages/sent",
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSettings = () => {
    return axios
    .get("http://localhost:5001/companies/profile",
    {
        headers: {
            Authorization: "Bearer " + localStorage.usertoken
         }
    })
    .then(response => {
        return response.data.data;
    })
    .catch(eror => {
        console.log(eror)
    })
}

export const updateSettings= data => {
    return axios
        .post("http://localhost:5001/companies/update", {
            "company_name": data.company_name,
            "roles": data.companyJobTypes,
            "settings": data.settings,
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Settings Updated")
             }, (error) => {
                console.log(error)
        })
}

export const addEmployee = user => {
    return axios
        .post("http://localhost:5001/companies/addemployees", {
            "email": user.email, 
            "time_of_joining": moment().format(),
            "job_type": user.job_type,
            "rank": parseInt(user.rank)
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Add Employee")
             }, (error) => {
                console.log(error)
        })
}

export const removeEmployee = user => {
    return axios
        .post("http://localhost:5001/companies/removeemployees", {
            "employees": [user["_id"]],
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Removed Employee")
             }, (error) => {
                console.log(error)
        })
}

export const updateEmployeeInfo = user => {
    return axios
        .post("http://localhost:5001/companies/updateemployee", {
            "id": parseInt(user.id),
            "job_type": user.job_type,
            "rank": parseInt(user.rank),
        }, 
         { headers: {
           Authorization: "Bearer " + localStorage.usertoken
        }}
        )
        .then((response) => {
            console.log("Update Employee")
             }, (error) => {
                console.log(error)
        })
}

export const listOfEmployees = () => {
    return axios
        .get("http://localhost:5001/companies/listofemployees",
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getShifts = date => {
    return axios
        .post("http://localhost:5002/GetShifts",{ 
                "start_date": date.start_date, 
                "end_date": date.end_date,
                "statuses": date.statuses
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const approveSwitches = data => {
    return axios
        .post("http://localhost:5002/ConfirmShiftSwap",{
        "swap_id": data.swapId,
        "status": data.status
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const getSwitches = data => {
    return axios
        .post("http://localhost:5002/GetShiftsSwaps",{
            "statuses":data
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            return response.data.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const submitWantedShift = data => {
    return axios
        .post("http://localhost:5001/companies/PrefenceFromManager",{
            "sunday":data.sunday,
            "monday":data.monday,
            "tuesday":data.tuesday,
            "wednesday":data.wednesday,
            "thursday":data.thursday,
            "friday":data.friday,
            "saturday":data.saturday
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Submitted Shifts")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const addShifts = data => {
    return axios
        .post("http://localhost:5001/companies/addshift",{
            "name": data.shift_name, 
            "start_time": data.start_time,
            "end_time":data.end_time,
            "job_type":data.job_type,
            "difficulty":data.difficulty,
            "date":data.date,
            "amount":data.amount_of_employees,
            "day_part":data.day_part,
            "employees":data.employees_for_shift,
            "note":data.shift_note
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Added Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const updateShift = data => {
    return axios
        .post("http://localhost:5001/companies/updateshift",{
            "id": data.id, 
            "name": data.name, 
            "start_time": data.start_time,
            "end_time":data.end_time,
            "job_type":data.job_type,
            "difficulty":data.difficulty,
            "date":data.date,
            "amount":data.amount,
            "day_part":data.day_part,
            "employees":data.employees,
            "note":data.note,
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Updated Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const removeShift = id => {
    return axios
        .post("http://localhost:5001/companies/deleteshift",{
            "id": id, 
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Removed Shift")
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const buildShifts = data => {
    return axios
        .post("http://localhost:5002/buildshift",{
            "start_date": data.startDate, 
            "end_date": data.endDate
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Build Shifts")
            return response.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}

export const acceptBuildShift = data => {
    return axios
        .post("http://localhost:5002/SetShiftsSchedule",{
            data
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.usertoken
             }
        })
        .then(response => {
            console.log("Accepted Build Shifts")
            return response.data;
        })
        .catch(eror => {
            console.log(eror)
        })
}
*/