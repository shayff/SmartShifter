from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.config import MongoConfig
from pymongo import MongoClient
from .schemas.deleteshift import validate_deleteshift

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doDeleteShift(user_input):
    data = validate_deleteshift(user_input)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:

            #update data of relevant company
            company_id = result["company"]

            # delete from db
            result = companies_collection.update_one({'_id': company_id}, {'$pull': {'shifts': {'id': data['id']}}})

            if result.modified_count > 0:
                return jsonify({'ok': True, 'msg': 'delete shift successfully'}), 200
            else:
                return jsonify({'ok': True, 'msg': 'Shift is not exist'}), 200

        else:
            return jsonify({'ok': False, 'msg': 'the company not exist'}), 401

    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

