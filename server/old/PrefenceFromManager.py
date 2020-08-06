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
    #data = validate_PrefenceFromManager(userInput)

   # if data["ok"]:
    #    data = data["data"]
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:
            # update data of relevante company
            company_id = result["company"]
            company = companies_collection.find_one_and_update({'_id': company_id},{'$set': data})
            print(company)
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200

        else:
            return jsonify({'ok': False, 'msg': 'User is not in company'}), 400
   # else:
    #    return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400


