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
            user_id = result['_id']
            #swap employees  id-employee_ask
            employee_ask = companies_collection.find_one({'_id': company_id, 'shifts_swaps.id': data['swap_id']},{'shifts_swaps.$.employee_ask'})
            print("employee_ask")
            print(employee_ask)

            #Update status to 'Confirmed'
            shift_swap = companies_collection.update({'_id': company_id, 'shifts_swaps.id': data['swap_id']},{'$set': {'shifts_swaps.$.status': 'Confirmed'}})

            #print(shift_swap)

            if shift_swap: #Exists
                return jsonify({'ok': True, 'msg': 'Created shift swap request successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'there is not swap with this id '}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

