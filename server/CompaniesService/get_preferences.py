from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def doGetPreferences():
    logged_in_user = get_jwt_identity()

    user_from_db = db.get_user(logged_in_user['_id'])

    if 'company' in user_from_db:
        company_id = user_from_db['company']
        company_from_db = db.companies_collection.find_one({'_id': company_id})

        preferences = company_from_db['prefence_from_manager']
        print(preferences)
        if preferences:
            return jsonify({'ok': True, 'msg': 'Successfully', 'data': preferences}), 200
        else:
            return jsonify({'ok': True, 'msg': 'There is no need to submit shifts now', 'data': preferences}), 200
    else:
        return jsonify({'ok': False, 'msg': 'User has no company'}), 401
