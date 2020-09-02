from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.update import validate_update


def doUpdate(user_input):
    data = validate_update(user_input)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({'_id': current_user['_id']})
        if "company" in user_from_db:

            #update data of relevante company
            company_id = user_from_db["company"]
            db.companies_collection.find_one_and_update({'_id': company_id}, {'$set': data})
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400