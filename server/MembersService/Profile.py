from pymongo import MongoClient
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token,get_jwt_identity
from config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']

def doProfile():
    loggedinUser = get_jwt_identity()
    #Search for user in database
    user = users_collection.find_one({'_id': loggedinUser['_id']})
    del user['password']
    return jsonify({'ok': True, 'data': user}), 200