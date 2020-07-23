from pymongo import MongoClient
from config import MongoConfig
from flask import jsonify
from flask_jwt_extended import get_jwt_identity


#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

def doGetShiftScheduled(data):
    current_user = get_jwt_identity()
    user = users_collection.find_one({'_id': current_user['_id']})

    # check if user has company
    if 'company' not in user:
        return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        company_id = user['company']
        company = companies_collection.find_one({'_id': companyId})
        swaps = company['shifts_swaps']

