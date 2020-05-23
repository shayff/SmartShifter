from pymongo import MongoClient
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
usersCollection = db['users']

def doProfile():
    loggedinUser = get_jwt_identity()
    #Search for user in database
    user = usersCollection.find_one({'_id': loggedinUser['_id']})
    del user['password']
    return jsonify({'ok': True, 'data': user}), 200