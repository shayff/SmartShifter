from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from config import MongoConfig
from .schemas.addshifts import validate_addshifts
from pymongo import MongoClient, ReturnDocument

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doAddShifts(data):
    data = validate_addshifts(data)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:
            #update data of relevant company
            company_id = result["company"]

            # update counter shifts in company
            doc = companies_collection.find_one_and_update({'_id': company_id}, {'$inc': {'shifts_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)
            # update id shift
            shift_id = doc['shifts_counter']
            data.update({'id': shift_id})

            # add shift status
            data.update({"status": "not_scheduled"})

            # insert to db
            companies_collection.find_one_and_update({'_id': company_id}, {'$push': {'shifts': data}})
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200

        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401

    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

