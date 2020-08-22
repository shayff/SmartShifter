from pymongo import MongoClient
from .schemas.addemployees import validate_addemployees
from flask import jsonify
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counters_collection = db["counters"]

def doAddEmployees(user_input):
    data = validate_addemployees(user_input)
    if data['ok']:
        employee_to_add = data['data']
        logged_in_user = get_jwt_identity()
        result = users_collection.find_one({'_id': logged_in_user['_id']})
        if 'company' in result:
            company_id = result['company']

            #look for the employee
            user_result = users_collection.find_one({'email': employee_to_add['email']})
            if user_result and 'company' not in user_result:
                # switch the email given from the user to the id
                employee_to_add["id"] = user_result["_id"]
                del employee_to_add["email"]

                # update employees in the company
                users_collection.find_one_and_update({'_id': employee_to_add["id"]}, {'$set': {'company': company_id}})

                doc = companies_collection.find_one_and_update({'_id': company_id},
                                                               {'$addToSet': {"employees": employee_to_add}})
                if doc:
                    return jsonify({'ok': True, 'msg': 'Employee has been added'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'User already have company'}), 409
        else:
            return jsonify({'ok': False, 'msg': 'Manager has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
