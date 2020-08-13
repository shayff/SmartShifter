from pymongo import MongoClient
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from ..config import MongoConfig
from server.MembersService.SendMessage import doSendMessage

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

def doSetShiftsSchedule(data):
        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        employees = set()
        if "company" in result:
            #update data of relevant company
            company_id = result["company"]
            shifts = data['data']
            doc = set_employees_to_shifts(company_id, employees, shifts)

            #send message to employees
            if doc.modified_count > 0:
                send_message_to_employees(employees)

                return jsonify({'ok': True, 'msg': 'Update shift successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'shift not exist'}), 400

        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401


def set_employees_to_shifts(company_id, employees, shifts):
    for key, value in shifts.items():
        doc = companies_collection.update_one({'_id': company_id, 'shifts.id': int(key)},
                                              {'$set': {'shifts.$.employees': value, "shifts.$.status": "scheduled"}})
        employees.update(value)
    return doc

def send_message_to_employees(employees):
    message = {'to': [list(employees)],
               'title': "You just scheduled to new shifts",
               "message": "Take a look at the shift page, you got new shifts"}
    doSendMessage(message)





