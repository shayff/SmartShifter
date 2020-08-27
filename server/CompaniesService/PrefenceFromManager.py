from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import ReturnDocument
from datetime import datetime

def doPrefenceFromManager(data):
        logged_in_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
        if "company" in user_from_db:
            # update data of relevante company
            company_id = user_from_db["company"]
            company = db.companies_collection.find_one_and_update({'_id': company_id},{'$set': {"prefence_from_manager" : data}})
            return jsonify({'ok': True, 'msg': 'Update prefence successfully'}), 200

        else:
            return jsonify({'ok': False, 'msg': 'User is not in company'}), 400
