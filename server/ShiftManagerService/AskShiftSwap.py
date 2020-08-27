from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient, ReturnDocument
from .schemas.askshiftswap import validate_askShiftSwap
from datetime import datetime

def doAskShiftSwap(user_input):
    data = validate_askShiftSwap(user_input)
    if data['ok']:
        data = data['data']
        logged_in_user = get_jwt_identity()
        result = db.users_collection.find_one({'_id': logged_in_user['_id']})

        #check if user has company
        if 'company' in result:
            company_id = result['company']

            # update shifts_swaps id
            doc = db.companies_collection.find_one_and_update({'_id': company_id}, {'$inc': {'shifts_swaps_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)

            #Check if the user is assigned to this shift
            shifts = doc['shifts']
            shift = [x for x in shifts if x["id"]==data['shift_id']]
            if logged_in_user['_id'] not in shift[0]['employees']:
                return jsonify({'ok': False, 'msg': "wrong shift id, You're not in this shift"}), 401

            prepare_shift_swap(data, doc, logged_in_user)

            # insert to db
            db.companies_collection.find_one_and_update({'_id': company_id}, {'$push': {'shifts_swaps': data}})
            return jsonify({'ok': True, 'msg': 'Created shift swap request successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401

            #update shift
            print(data['shift_id'])

            company = db.companies_collection.find_one({'_id': company_id},{'shifts':1})
            print(company)
            for x in company['shifts']:
                if data['shift_id'] == x['id']:
                    print(x)

            data.update({'date_shift':shift['date']})
            data.update({'start time':shift['start time']})
            data.update({'end time':shift['end time']})


def prepare_shift_swap(data, doc, logged_in_user):
    # update counter shifts swaps id
    shifts_swaps_id = doc['shifts_swaps_counter']
    data.update({'id': shifts_swaps_id})
    # update the employee ask for
    data.update({"id_employee_ask": logged_in_user['_id']})
    # update time created
    date = datetime.now()
    data.update({"time_created": date.ctime()})
    # add status
    data.update({"status": "wait_for_swap"})
