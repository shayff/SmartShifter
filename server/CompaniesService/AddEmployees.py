from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.addemployees import validate_addemployees

def doAddEmployees(user_input):
    data = validate_addemployees(user_input)
    if data['ok']:
        employee_to_add = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user['_id'])
        if 'company' in user_from_db:
            company_id = user_from_db['company']

            #look for the employee
            employee_to_add = db.users_collection.find_one({'email': employee_to_add['email']})
            if employee_to_add and 'company' not in employee_to_add:
                # switch the email given from the user to the id
                employee_to_add["id"] = employee_to_add["_id"]
                del employee_to_add["email"]

                # update employees in the company
                db.users_collection.find_one_and_update({'_id': employee_to_add["id"]}, {'$set': {'company': company_id}})

                doc = db.companies_collection.find_one_and_update({'_id': company_id},
                                                               {'$addToSet': {"employees": employee_to_add}})
                if doc:
                    return jsonify({'ok': True, 'msg': 'Employee has been added'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'User already have company'}), 409
        else:
            return jsonify({'ok': False, 'msg': 'Manager has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
