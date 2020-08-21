from pymongo import MongoClient
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
usersCollection = db['users']
companies_collection = db['companies']

def doProfile():
    loggedinUser = get_jwt_identity()
    #Search for user in database
    user = usersCollection.find_one({'_id': loggedinUser['_id']})
    if(user['company']):
        company_id = user['company']
        company = companies_collection.find_one({'_id': company_id})
        user['company name']= company['company name']

    print(user)
    del user['password']
    return jsonify({'ok': True, 'data': user}), 200