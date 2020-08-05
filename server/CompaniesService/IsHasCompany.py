from pymongo import MongoClient
from .schemas.create import validate_create
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


def doIsHasCompany():
    current_user = get_jwt_identity()
    result = users_collection.find_one({'_id': current_user['_id']})
    company_id= result['company']

    company = companies_collection.find_one({'_id': company_id})
    if current_user['_id'] in company['managers']:
        return jsonify({'ok': True, 'data': True}), 200
    else:
        return jsonify({'ok': True, 'data': False}), 200