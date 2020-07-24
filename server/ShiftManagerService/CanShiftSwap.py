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

#	"shift_id": 3"

def doCanShiftSwap(userInput):
    data = validate_CanShiftSwap(userInput)
    if data['ok']:
        data = data['data']
        print(data)
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        #check if user has company
        if 'company' in result:
            company_id = result['company']
            shift_swap = companies_collection.find_one({'_id': company_id},
                                                       {'shifts_swap': {'$elemMatch': {'shift_id': data['shift_id']}}})

            print(shift_swap)
            status = shift_swap['status']
            print(status)
            if status == 'wait_for_swap':
                # update the name and id of employee can swap
                doc = companies_collection.find_one_and_update({'_id': company_id, 'shifts_swaps.shift_id': data['shift_id']},
                                                               {'$set': {'shifts_swaps.$.id_employee_can': current_user['_id']}})
                print(doc)
                doc = companies_collection.find_one_and_update({'_id': company_id, 'shifts_swaps.shift_id': data['shift_id']},
                                                               {'$set':{'shifts_swaps.$.name_employee_can':
                                                                            current_user['first name']+" "+ current_user['last name']}})
                print(doc)

                # Update status to 'wait_for_Confirmed'
                doc = companies_collection.update({'_id': company_id, 'shifts_swaps.shift_id': data['shift_id']},
                                            {'$set': {'shifts_swaps.$.status': 'wait_for_Confirmed'}})
                print(doc)
                return jsonify({'ok': True, 'msg': 'Created can shift swap request successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'the status is not -wait_for_swap'}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401


