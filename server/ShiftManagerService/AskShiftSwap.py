from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient, ReturnDocument
from config import MongoConfig
from .schemas.askshiftswap import validate_askShiftSwap
from datetime import datetime

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
'''Maybe we need to check if the shit the user ask for exist and scheduled for him'''

def doAskShiftSwap(userInput):
    data = validate_askShiftSwap(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        #check if user has company
        if 'company' in result:
            company_id = result['company']

            # update shifts_swaps id
            doc = companies_collection.find_one_and_update({'_id': company_id}, {'$inc': {'shifts_swaps_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)
            shifts_swaps_id = doc['shifts_swaps_counter']
            data.update({'id': shifts_swaps_id})

            # update the employee ask for
            data.update({"employee_ask": current_user['_id']})

            # update time created
            date = datetime.now()
            data.update({"time_created": date.ctime()})

            # add status
            data.update({"status":"wait_for_swap"})

            # insert to db
            companies_collection.find_one_and_update({'_id': company_id}, {'$push': {'shifts_swaps': data}})
            return jsonify({'ok': True, 'msg': 'Created shift swap request successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401


'''
{
"id": 1
"shift_id" :
"employee_ask" :
"status":
"created_date":


}

'''