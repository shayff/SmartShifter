from datetime import datetime
from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.prefenceFormWorker import validate_prefenceFromWorker

def set_prefence_from_employee(data):
    '''
    This method update the prefernces given from employee
    '''
    data = validate_prefenceFromWorker(data)
    if data["ok"]:
        data = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user['_id'])

        if user_from_db:
            if 'company' in user_from_db:
                doc = db.companies_collection.find_one_and_update({'_id': user_from_db['company'], 'employees.id':logged_in_user['_id']},
                                            {'$set': {'employees.$.preference': data["preference"]}})

                return jsonify({'ok': True, 'msg': 'Update prefence successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'User has no company'}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User not exist'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400