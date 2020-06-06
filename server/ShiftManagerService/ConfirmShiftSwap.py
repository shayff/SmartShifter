from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient, ReturnDocument
from config import MongoConfig
from .schemas.confirmshiftswap import validate_confirmShiftSwap
from datetime import datetime

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doConfirmShiftSwap(userInput):
    data = validate_confirmShiftSwap(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        #check if user has company
        if 'company' in result:
            company_id = result['company']
            shift_swap = companies_collection.find_one({'_id': company_id, 'shifts_swaps.id': data['id']},{'shifts_swaps.$':1})
            shift_swap = shift_swap['shifts_swaps'][0]
            ##            shift_swap = companies_collection.find_one({"$and": [{'_id': company_id}, {'shifts_swaps.id': data['id']}]})
            print(shift_swap)


            #need to finish update of shift

            return jsonify({'ok': True, 'msg': 'Created shift swap request successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401

