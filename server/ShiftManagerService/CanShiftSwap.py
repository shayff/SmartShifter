from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient, ReturnDocument
from config import MongoConfig
from .schemas.canshiftswap import validate_CanShiftSwap
from datetime import datetime

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]


def doCanShiftSwap(userInput):
    data = validate_CanShiftSwap(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        #check if user has company
        if 'company' in result:
            company_id = result['company']
            shift_swap = companies_collection.find_one({'_id': company_id},
                                                {"shifts_swaps": {"$elemMatch": {"id": data['swap_id']}}})
            status = shift_swap["shifts_swaps"][0]["status"]
            shift_id = shift_swap["shifts_swaps"][0]["shift_id"]
            if status == 'wait_for_swap':
                # update the name and id of employee can swap
                doc = companies_collection.find_one_and_update({'_id': company_id, 'shifts_swaps.shift_id': shift_id},
                                                               {'$set': {'shifts_swaps.$.id_employee_can': current_user["_id"]}})

                # Update status to 'wait_for_confirm'
                doc = companies_collection.update({'_id': company_id, 'shifts_swaps.shift_id': shift_id},
                                            {'$set': {'shifts_swaps.$.status': 'wait_for_confirm'}})

                return jsonify({'ok': True, 'msg': 'update shift swap request successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'the status is not wait_for_swap'}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401


