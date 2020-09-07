from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_list_of_employees():
    logged_in_user = get_jwt_identity()
    user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
    if 'company' in user_from_db:
        employeesResult = []
        company_id = user_from_db['company']
        company_from_db = db.companies_collection.find_one({'_id': company_id})

        # get all the employees from the company
        employees = company_from_db['employees']

        # iterate through each employee and get full details
        for employee in employees:
            employee_from_db = db.get_user(employee['id'])
            employee_from_db['job type'] = employee['job type']
            employee_from_db['rank'] = employee['rank']

            # remove data we dont need
            delete_unnecessary_data(employee_from_db)

            #add to list of all employees
            employeesResult.append(employee_from_db)

        return jsonify({'ok': True, 'msg': 'Successfully', 'data': employeesResult}), 200
    else:
        return jsonify({'ok': False, 'msg': 'User has no company'}), 401

def delete_unnecessary_data(employee_from_db):
    del employee_from_db['password']
    if 'company' in employee_from_db:
        del employee_from_db['company']

