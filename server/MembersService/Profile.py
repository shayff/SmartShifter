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
    logged_in_user = get_jwt_identity()
    #Search for user in database
    user = usersCollection.find_one({'_id': logged_in_user['_id']})
    user["is_has_company"] = "company" in user
    if user['company']:
        company_id = user['company']
        company = companies_collection.find_one({'_id': company_id})
        user["company name"] = company["company name"]


    del user['password']
    print(user)
    return jsonify({'ok': True, 'data': user}), 200