import React from 'react';
import {AppRegistry, SectionList ,StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; 


// export default axios.create({
// baseURL: 'http://7d871c3f76cf.ngrok.io'





export default axios.create({
  baseURL:'http://4ff778c69f53.ngrok.io',

})


// const Get_Server_login_to_app = user => {
//   console.log(user);

//   return axios
//       .post('http://127.0.0.1:5000/login', {
//           "email": user.email,
//           "password": user.password
//       })
//       .then(response => {
//           console.log("response");
//           console.log(response);
//           localStorage.setItem('usertoken', response.data.data.token);
//           return response.data.data.token
//       })
//       .catch(eror => {
//         console.log("erorrrrrrr");
//         //console.error(eror);
//           console.log(eror);
//       })
// }







// async function Get_Server_login_to_app(params) {
//     console.log(params.email, params.password);
//     try {
//       let response = await fetch('http://localhost:5000/login',
//         {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           "email": params.email,
//           "password": params.password
//         })
//       });
//       let json = await response.json();
//       console.log(json);
//       return json.ok;
//     } catch (error) {
//         console.log('disable connect to server '+ error);
//     }
//   }

// export function Get_preferences_manager(params) {
//     try {

//         let responseJson =
//         {
//             sunday:{
//                date: '2020-07-26',
//                preference:[0,2,1] 
//             },
//             monday:{
//                date:'2020-07-27',
//                preference:[2]
//             },
//             tuesday:{
//                date:'2020-07-28',
//                preference:[]
//             },
//             wednesday:{
//                date:'2020-07-29',
//                preference:[]
//             },
//             thursday:{
//                date:'2020-07-30',
//                preference:[]
//             },
//             friday:{
//                date:'2020-07-31',
//                preference:[]
//             },
//             saturday:{
//                date:'2020-08-01',
//                preference:[]
//             }
//          };

//         return responseJson;
//     } catch (error) {
//         console.log('disable connect to server '+ error);
//         console.error(error);
//     }
//  }

 export function Get_arrangement_shifts(params) {
  try {

      let responseJson =
      {
        "data": {
          "2020-08-09": [
            {
              "amount": 1,
              "date": "2020-08-09",
              "day part": [
                0
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 51,
                  "first name": "nel",
                  "last name": "nehemia"
                }
              ],
              "end time": "12:00",
              "id": 1,
              "job type": "waiter",
              "name": "Morning",
              "note": "",
              "start time": "07:00",
              "status": "scheduled"
            },
            {
              "amount": 1,
              "date": "2020-08-09",
              "day part": [
                2
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 52,
                  "first name": "b",
                  "last name": "nehemia"
                }
              ],
              "end time": "22:00",
              "id": 11,
              "job type": "host",
              "name": "evening",
              "note": "",
              "start time": "18:00",
              "status": "scheduled"
            },
            {
              "amount": 2,
              "date": "2020-08-09",
              "day part": [
                0
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 53,
                  "first name": "c",
                  "last name": "nehemia"
                },
                {
                  "_id": 54,
                  "first name": "d",
                  "last name": "nehemia"
                }
              ],
              "end time": "22:00",
              "id": 12,
              "job type": "waiter",
              "name": "evening",
              "note": "",
              "start time": "18:00",
              "status": "scheduled"
            }
          ],
          "2020-08-10": [
            {
              "amount": 1,
              "date": "2020-08-10",
              "day part": [
                0
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 52,
                  "first name": "b",
                  "last name": "nehemia"
                }
              ],
              "end time": "12:00",
              "id": 2,
              "job type": "waiter",
              "name": "Morning",
              "note": "",
              "start time": "07:00",
              "status": "scheduled"
            },
            {
              "amount": 2,
              "date": "2020-08-10",
              "day part": [
                1
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 53,
                  "first name": "c",
                  "last name": "nehemia"
                },
                {
                  "_id": 54,
                  "first name": "d",
                  "last name": "nehemia"
                }
              ],
              "end time": "18:00",
              "id": 7,
              "job type": "waiter",
              "name": "noon",
              "note": "",
              "start time": "12:00",
              "status": "scheduled"
            },
            {
              "amount": 2,
              "date": "2020-08-10",
              "day part": [
                2
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 55,
                  "first name": "e",
                  "last name": "nehemia"
                },
                {
                  "_id": 56,
                  "first name": "f",
                  "last name": "nehemia"
                }
              ],
              "end time": "22:00",
              "id": 13,
              "job type": "waiter",
              "name": "evening",
              "note": "",
              "start time": "18:00",
              "status": "scheduled"
            },
            {
              "amount": 1,
              "date": "2020-08-10",
              "day part": [
                2
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 57,
                  "first name": "g",
                  "last name": "nehemia"
                }
              ],
              "end time": "22:00",
              "id": 14,
              "job type": "host",
              "name": "evening",
              "note": "",
              "start time": "18:00",
              "status": "scheduled"
            }
          ],
          "2020-08-11": [
            {
              "amount": 1,
              "date": "2020-08-11",
              "day part": [
                0
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 51,
                  "first name": "a",
                  "last name": "nehemia"
                }
              ],
              "end time": "12:00",
              "id": 3,
              "job type": "waiter",
              "name": "Morning",
              "note": "",
              "start time": "07:00",
              "status": "scheduled"
            },
            {
              "amount": 2,
              "date": "2020-08-11",
              "day part": [
                1
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 52,
                  "first name": "b",
                  "last name": "nehemia"
                },
                {
                  "_id": 53,
                  "first name": "c",
                  "last name": "nehemia"
                }
              ],
              "end time": "18:00",
              "id": 8,
              "job type": "waiter",
              "name": "noon",
              "note": "",
              "start time": "12:00",
              "status": "scheduled"
            },
            {
              "amount": 1,
              "date": "2020-08-11",
              "day part": [
                2
              ],
              "difficulty": 2,
              "employees": [
                {
                  "_id": 54,
                  "first name": "d",
                  "last name": "nehemia"
                }
              ],
              "end time": "22:00",
              "id": 15,
              "job type": "host",
              "name": "evening",
              "note": "",
              "start time": "18:00",
              "status": "scheduled"
            }
          ]
        },
        "ok": true
      };

      return responseJson;
  } catch (error) {
      console.log('disable connect to server '+ error);
      console.error(error);
  }
}

// export function Get_masseges_server_data(params) {
//     try {
   

//         let responseJson =
//         {
//             "data": [
//                       {
//                         "_id": 14,
//                         "attached": [],
//                         "from": 9,
//                         "message": "ok",
//                         "name_sender": "eliran mastor",
//                         "time_created": "Wed Jul 22 19:24:31 2020",
//                         "title": "Stom tapa",
//                         "to": [
//                           2
//                         ]
//                       },
//               {
//                 "_id": 13,
//                 "attached": [],
//                 "from": 9,
//                 "message": "44",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 19:14:33 2020",
//                 "title": "wtf wtttt 232131",
//                 "to": [
//                   2
//                 ]
//               },
//               {
//                 "_id": 12,
//                 "attached": [],
//                 "from": 9,
//                 "message": "11",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 19:13:53 2020",
//                 "title": "s",
//                 "to": [
//                   2
//                 ]
//               },
//               {
//                 "_id": 11,
//                 "attached": [],
//                 "from": 9,
//                 "message": "ssssssssssss",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 18:48:10 2020",
//                 "title": "wtf",
//                 "to": [
//                   2
//                 ]
//               },
//               {
//                 "_id": 10,
//                 "attached": [
//                   ""
//                 ],
//                 "from": 9,
//                 "message": "esdfsdfdfdfsdfs",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 18:45:35 2020",
//                 "title": "heeeeeeeeeee",
//                 "to": [
//                   2
//                 ]
//               },
//               {
//                 "_id": 9,
//                 "attached": [
//                   ""
//                 ],
//                 "from": 9,
//                 "message": "s",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 18:44:11 2020",
//                 "title": "hello",
//                 "to": [
//                   2,
//                   4,
//                   5,
//                   11,
//                   21,
//                   13
//                 ]
//               },
//               {
//                 "_id": 7,
//                 "attached": [
//                   ""
//                 ],
//                 "from": 9,
//                 "message": "44",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 18:33:32 2020",
//                 "title": "44",
//                 "to": [
//                   2,
//                   4,
//                   5,
//                   11,
//                   21,
//                   13
//                 ]
//               },
//               {
//                 "_id": 6,
//                 "attached": [
//                   ""
//                 ],
//                 "from": 9,
//                 "message": "ss",
//                 "name_sender": "eliran mastor",
//                 "time_created": "Mon Jul 20 18:33:04 2020",
//                 "title": "ss",
//                 "to": [
//                   2,
//                   4,
//                   5,
//                   11,
//                   21,
//                   13
//                 ]
//               },
//               {
//                 "_id": 1,
//                 "from": 1,
//                 "message": "bla bla",
//                 "name_sender": "nely NehNeh",
//                 "time_created": "Mon Jul 20 10:15:11 2020",
//                 "title": "hello",
//                 "to": [
//                   2
//                 ]
//               }
//             ],
//             "msg": "list of messages:",
//             "ok": true
//           };

//         return responseJson;
//     } catch (error) {
//         console.log('disable connect to server '+ error);
//         console.error(error);
//     }
//  }
  
// async function Get_Server_login_to_app(params) {
//     try {
//         console.log('data sent to server '+ params.email, params.password);

//         let response = await fetch('http://bc03d73ce514.ngrok.io/login',{
//             method: 'POST',
//             mode: 'no-cors',
//             hesders: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json' //'application/json; charset=utf-8; text/plain; charset=utf-16'
//             },
//             body: JSON.stringify({"email": params.email, "password": params.password})
//         });
//         let responseJson = await response.json();
//         console.log('data from server '+ responseJson.msg);
//         console.log('data from server '+ responseJson.msg);

//         return responseJson.ok;
//     } catch (error) {
//         console.log('disable connect to server '+ error);
//         console.error(error);
//     }
//  }

// export {Get_Server_login_to_app};
// */