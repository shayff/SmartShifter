from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.CompaniesService.classes.company import company

def get_list_of_employees():
    '''
    This method return get list of the employees from the current company
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])

    if "company" in user_from_db:
        list_of_employees = []
        company_id = user_from_db["company"]
        company_from_db = company(company_id)

        list_of_employees = company_from_db.get_employees_full_data()
        print(list_of_employees)
        return jsonify({"ok": True, "msg": 'Successfully', 'data': list_of_employees}), 200
    else:
        return jsonify({"ok": False, "msg": 'User has no company'}), 401