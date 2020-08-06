from pymongo import MongoClient
from flask import jsonify
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


def doGetPreferences():
    current_user = get_jwt_identity()
    print(current_user)
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' not in result:
        return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        companyId = result['company']
        company = companies_collection.find_one({'_id': companyId})
        preferences = company['prefence_from_manager']
        return jsonify({'ok': True, 'msg': 'Successfully', 'data': preferences}), 200