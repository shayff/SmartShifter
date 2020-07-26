import axios from 'axios'
import moment from 'moment'

export const register = newUser => {
    return axios
        .post("/register", {
            "first name": newUser.first_name,
            "last name": newUser.last_name,
            "email": newUser.email,
            "password": newUser.password,
            "id number": newUser.id_number,
            "phone": newUser.phone,
            "address": newUser.address,
            "date of birth": newUser.date_of_birth
        })
        .then((response) => {
            console.log("Registered")
             }, (error) => {
                console.log(error)
        })
}

export const login = user => {
    return axios
        .post("/login", {
            "email": user.email,
            "password": user.password
        })
        .then(response => {
            localStorage.setItem('usertoken', response.data.data.token)
            return response.data.data.token
        })
        .catch(eror => {
            console.group("no")
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
            "first name": user.first_name,
            "last name": user.last_name,
            "email": user.email, 
            "password": user.password,
            "id number": user.id_number,
            "phone": user.phone,
            "address": user.address,
            "date of birth": user.date_of_birth
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

export const sendMessage = message => {
    return axios
        .post("/sendmessage",{
        "to":message.toWho,
        "title":message.title,
        "message":message.textMessage,
        "attached":message.attached
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

export const getMessages= () => {
    return axios
        .get("/getmessage",
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

export const updateSettings= user => {
    return axios
        .post("http://localhost:5001/companies/update", {
            "company name": user.company_name,
            "settings": user.settings,
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
        //     "first name": user.first_name,
        //     "last name": user.last_name,
        //     "gender": user.last_name,
            // "password": user.password,
            // "id number": user.id_number,
            // "phone": user.phone,
            // "address": user.address,
            // "date of birth": user.date_of_birth,
            "employees": [{
            "email": user.email, 
            "time of joining": moment().format(),
            "job type": [user.job_type],
            "rank": parseInt(user.rank)}]
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
          //  "first name": user.first_name,
        //    "last name": user.last_name,
        //    "gender": user.last_name,
            "id": parseInt(user.id),
       //     "phone": user.phone,
      //      "address": user.address,
      //      "date of birth": user.date_of_birth,
            "job type": [user.job_type],
            "rank": parseInt(user.rank),
        //    "time of joining": moment().format(),
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

export const ListOfEmployees = () => {
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
        .post("http://localhost:5002/GetShiftScheduled",{ 
                "start_date": date.start_date, 
                "end_date": date.end_date
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
        .post("http://localhost:5002/confirmshiftswap",{
        "swap_id":data.swapId,
        "status":data.status
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
            "preferences_from_manager":data
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

export const buildShifts = data => {
    return axios
        .post("http://localhost:5002/buildshift",{
            "start_date": data.start_date, 
            "end_date": data.end_date,
            "pre_scheduled":data.preScheduled
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