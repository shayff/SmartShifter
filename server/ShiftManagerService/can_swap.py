from datetime import datetime
from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.canshiftswap import validate_CanShiftSwap

def doCanShiftSwap(userInput):
    data = validate_CanShiftSwap(userInput)
    if data['ok']:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user['_id'])

        #check if user has company
        if 'company' in user_from_db:
            company_id = user_from_db['company']
            shift_swap = db.companies_collection.find_one({'_id': company_id},
                                                           {"shifts_swaps": {"$elemMatch": {"id": data['swap_id']}}})
            status = shift_swap["shifts_swaps"][0]["status"]
            shift_id = shift_swap["shifts_swaps"][0]["shift_id"]

            if status == 'wait_for_swap':
                # update the name and id of employee can swap
                doc = db.companies_collection.find_one_and_update({'_id': company_id,
                                                                   'shifts_swaps.id': data['swap_id']},
                                                                   {'$set': {'shifts_swaps.$.id_employee_can': logged_in_user["_id"]}})

                # Update status to 'wait_for_confirm'
                doc = db.companies_collection.update({'_id': company_id, 'shifts_swaps.id': data['swap_id']},
                                                      {'$set': {'shifts_swaps.$.status': 'wait_for_confirm'}})

                return jsonify({'ok': True, 'msg': 'update shift swap request successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'the status is not wait_for_swap'}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401