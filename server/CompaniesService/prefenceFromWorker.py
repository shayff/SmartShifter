from pymongo import MongoClient
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from .schemas.prefenceFormWorker import validate_prefenceFromWorker

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doPrefenceFromWorker(data):
    data = validate_prefenceFromWorker(data)
    if data["ok"]:
        data = data["data"]
        current_user = get_jwt_identity()
        print(current_user)
        result = users_collection.find_one({'_id': current_user['_id']})
        print(companies_collection.find_one({'_id': result['company'], 'employees.id':current_user['_id']}))

        if 'company' not in result:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
        else:
            doc = companies_collection.find_one_and_update({'_id': result['company'], 'employees.id':current_user['_id']},
                                        {'$set': {'employees.$.preference': data["preference"]}})
            return jsonify({'ok': True, 'msg': 'Update prefence successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400