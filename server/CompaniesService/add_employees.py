from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.addemployees import validate_addemployees

def add_employees(user_input):
    data = validate_addemployees(user_input)
    if data['ok']:
        employee_to_add = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user['_id'])

        if 'company' in user_from_db:
            company_id = user_from_db['company']

            # get employee from database
            employee_from_db = db.get_user_by_email(employee_to_add['email'])

            if employee_from_db and 'company' not in employee_from_db:

                # switch the email given from the user to the id
                employee_to_add["id"] = employee_from_db["_id"]
                del employee_to_add["email"]

                # update employees company field and add to company employees
                db.update_user_company(employee_to_add["id"], company_id)
                doc = db.add_employee_to_company(company_id, employee_to_add)

                if doc:
                    return jsonify({'ok': True, 'msg': 'Employee has been added'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'User already have company'}), 409
        else:
            return jsonify({'ok': False, 'msg': 'Manager has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400