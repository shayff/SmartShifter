from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from config import MongoConfig
from .schemas.update import validate_update

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doUpdate(data):
    data = validate_update(data)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:

            #update data of relevante company
            company_id = result["company"]
            companies_collection.find_one_and_update({'_id': company_id}, {'$set': data})
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400