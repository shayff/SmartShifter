from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from server.config import MongoConfig


cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doProfile():
    loggedinUser = get_jwt_identity()
    result = users_collection.find_one({'_id': loggedinUser['_id']})
    if "company" in result:

        #get data of relevante company
        company_id = result["company"]
        company_details = companies_collection.find_one({'_id': company_id})

        return jsonify({'ok': True, 'data': company_details}), 200
    else:
        return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
