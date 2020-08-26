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
    '''
    This method delete shift by given id, it's also check for shift_swaps request and remove them.
    '''
    data = validate_deleteshift(user_input)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        shift_id = data["id"]
        result = users_collection.find_one({'_id': current_user['_id']})
        if "company" in result:
            company_id = result["company"]

            if is_shift_exist(company_id, shift_id):
                delete_shift(company_id, shift_id)

                return jsonify({'ok': True, 'msg': 'delete shift successfully'}), 200
            else:
                return jsonify({'ok': True, 'msg': 'Shift is not exist'}), 206
        else:
            return jsonify({'ok': False, 'msg': 'the company not exist'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400


def delete_shift(company_id, shift_id):
    # delete relevant swaps
    companies_collection.update_one({'_id': company_id}, {'$pull': {'shifts_swaps': {'shift_id': shift_id}}})
    # delete the shift
    companies_collection.update_one({'_id': company_id}, {'$pull': {'shifts': {'id': shift_id}}})


def is_shift_exist(company_id, shift_id):
    doc = companies_collection.find_one({'_id': company_id},
                                        {"shifts": {"$elemMatch": {"id": shift_id}}, "shifts.employees": 1})
    return "shifts" in doc