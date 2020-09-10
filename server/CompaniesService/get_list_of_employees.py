from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_list_of_employees():
    '''
    This method return get list of the employees from the current company
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])

    if 'company' in user_from_db:
        list_of_employees = []
        company_id = user_from_db['company']
        company_from_db = db.get_company(company_id)

        # get all the employees ids from the company
        employees = company_from_db['employees']

        # iterate through each employee and get full details
        for employee in employees:

            # get full data of employee
            employee_from_db = update_user_full_data(employee)

            # remove data we dont need
            delete_unnecessary_data(employee_from_db)

            #add to list of all employees
            list_of_employees.append(employee_from_db)

        print(list_of_employees)
        return jsonify({"ok": True, "msg": 'Successfully', 'data': list_of_employees}), 200
    else:
        return jsonify({"ok": False, "msg": 'User has no company'}), 401


def update_user_full_data(employee):
    employee_from_db = db.get_user(employee["id"])
    employee_from_db["job_type"] = employee["job_type"]
    employee_from_db['rank'] = employee['rank']
    return employee_from_db

def delete_unnecessary_data(employee_from_db):
    del employee_from_db['password']
    if 'company' in employee_from_db:
        del employee_from_db['company']

