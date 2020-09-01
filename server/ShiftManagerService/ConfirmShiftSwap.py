from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
from .schemas.confirmshiftswap import validate_confirmShiftSwap
from server.MembersService.send_message import doSendMessage

def doConfirmShiftSwap(user_input):
    data = validate_confirmShiftSwap(user_input)
    if data['ok']:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})

        #check if user has company
        if 'company' in user_from_db:
            company_id = user_from_db['company']
            user_id = user_from_db['_id']
            shift_swap = db.companies_collection.find_one({'_id': company_id , 'shifts_swaps.id': data['swap_id']}, {'shifts_swaps.$': data['swap_id']})

            if shift_swap: #Exists
                shift_swap = shift_swap['shifts_swaps'][0]
                if (shift_swap['status'] == 'wait_for_confirm'):
                    if(data['status'] == 'confirm'):

                        # search for the employees in the given shift
                        shifts = db.companies_collection.find_one({'_id': company_id, 'shifts.id': shift_swap['shift_id']}, {'shifts': {'$elemMatch': {"id":shift_swap["shift_id"]}}, "shifts.employees":1})
                        employees = shifts['shifts'][0]['employees']

                        # switch the employees
                        employees = [shift_swap['id_employee_can'] if x==shift_swap['id_employee_ask'] else x for x in employees]

                        # update the new employes list in database
                        db.companies_collection.update({'_id': company_id, 'shifts.id': shift_swap['shift_id']},
                                                        {'$set': {'shifts.$.employees': employees}})

                        new_status = 'confirmed'
                        message = {'to': {"employees": [shift_swap['id_employee_can'], shift_swap['id_employee_ask']]},
                                           'title': "Swap request confirm", "message": "your swap request confirmed"}

                    else:
                        new_status = 'wait_for_swap'
                        doc = db.companies_collection.find_one_and_update(
                            {'_id': company_id, 'shifts_swaps.id': data['swap_id']},
                            {'$unset': {'shifts_swaps.$.id_employee_can': "" }}) #need to delete
                        message = {
                                    'to': {"employees": [shift_swap['id_employee_can']]},
                                    'title': "Swap request denied",
                                   "message": "denied"
                                   }

                    #change the status of the shiftswap
                    db.companies_collection.update({'_id': company_id, 'shifts_swaps.id': data['swap_id']},
                                                    {'$set': {'shifts_swaps.$.status': new_status}})

                    #notice the employees
                    print("message:")
                    print(message)
                    doSendMessage(message)

                    return jsonify({'ok': True, 'msg': 'Update swap request successfully'}), 200
                else:
                    return jsonify({'ok': False, 'msg': 'there is no need for confirm'}), 401
            else:
                return jsonify({'ok': False, 'msg': 'there is no swap with this id '}), 401
        else:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400