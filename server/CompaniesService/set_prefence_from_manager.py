from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def set_prefence_from_manager(data):
    '''
    This method update the prefernces the managaer ask for
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user['_id'])

    if "company" in user_from_db:
        company_id = user_from_db["company"]
        db.update_prefence_of_company(company_id, data)

        return jsonify({'ok': True, 'msg': 'Update prefence successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'User is not in company'}), 400