from pymongo import MongoClient
from flask import jsonify
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']
counters_collection = db['counters']

def doListOfEmployees():
    current_user = get_jwt_identity()
    print(current_user)
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' in result:
        employeesResult = []
        companyId = result['company']
        company = companies_collection.find_one({'_id': companyId})

        #Get all the employees from the company
        employees = company['employees']

        #iterate through each employee and get his full details
        for employee in employees:
            print(employee)
            employeeFromDb = users_collection.find_one({'_id': employee['id']})
            employeeFromDb['job type'] = employee['job type']
            employeeFromDb['rank'] = employee['rank']

            #remove unnesery data
            del employeeFromDb['password']
            if 'company' in employeeFromDb:
                del employeeFromDb['company']

            #add to list of all employees
            employeesResult.append(employeeFromDb)

        return jsonify({'ok': True, 'msg': 'Successfully', 'data': employeesResult}), 200
    else:
        return jsonify({'ok': False, 'msg': 'User has no company'}), 401

