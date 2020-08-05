from pymongo import MongoClient
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]


def doPrefenceFromManager(data):
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:
            # update data of relevante company
            company_id = result["company"]
            company = companies_collection.find_one_and_update({'_id': company_id},{'$set': {"prefence_from_manager" : data}})
            return jsonify({'ok': True, 'msg': 'Update prefence successfully'}), 200

        else:
            return jsonify({'ok': False, 'msg': 'User is not in company'}), 400
