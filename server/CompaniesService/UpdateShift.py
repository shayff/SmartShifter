from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from server.config import MongoConfig
from .schemas.updateshift import validate_updateshift


cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doUpdateShift(data):
    data = validate_updateshift(data)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        if "company" in result:
            #update data of relevant company
            company_id = result["company"]
            shift_id = data['id']

            doc = companies_collection.update_one({'_id': company_id, 'shifts.id': shift_id}, {'$set':
                                                                                                   {'shifts.$': data}})
            if doc.modified_count > 0:
                return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'shift not exist'}), 400
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401

    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

