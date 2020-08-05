from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient, ReturnDocument
from server.config import MongoConfig
from .schemas.confirmshiftswap import validate_confirmShiftSwap
from datetime import datetime
from server.MembersService.SendMessage import doSendMessage

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

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
            shift_swap = companies_collection.find_one({'_id': company_id , 'shifts_swaps.id': data['swap_id']},{'shifts_swaps.$': data['swap_id']})
            print(shift_swap)

            if shift_swap: #Exists
                shift_swap = shift_swap['shifts_swaps'][0]
                if (shift_swap['status'] == 'wait_for_confirm'):
                    if(data['status'] == 'confirm'):
                        # search for the employees in the given shift
                        shifts = companies_collection.find_one({'_id': company_id, 'shifts.id': shift_swap['shift_id']},{'shifts': {'$elemMatch': {"id":shift_swap["shift_id"]} },"shifts.employees":1})
                        employees = shifts['shifts'][0]['employees']

                        # switch the employees
                        employees = [shift_swap['id_employee_can'] if x==shift_swap['id_employee_ask'] else x for x in employees]

                        # update the new employes list in database
                        companies_collection.update({'_id': company_id, 'shifts.id': shift_swap['shift_id']},
                                                                                {'$set': {'shifts.$.employees': employees}})

                        new_status = 'confirmed'
                        message = {'to': [shift_swap['id_employee_can'], shift_swap['id_employee_ask']],
                                           'title': "Swap request confirm", "message": "your swap request confirmed"}

                    else:
                        new_status = 'wait_for_swap'
                        doc = companies_collection.find_one_and_update(
                            {'_id': company_id, 'shifts_swaps.id': data['swap_id']},
                            {'$unset': {'shifts_swaps.$.id_employee_can': "" }}) #need to delete
                        message = {'to': [shift_swap['id_employee_can']],
                                           'title': "Swap request denied", "message": "denied"}

                    #change the status of the shiftswap
                    companies_collection.update({'_id': company_id, 'shifts_swaps.id': data['swap_id']},
                                                {'$set': {'shifts_swaps.$.status': new_status}})

                    #notice the employees
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

