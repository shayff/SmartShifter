from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
from .schemas.confirmshiftswap import validate_confirmShiftSwap
from server.MembersService.send_message import send_message

def confirm_shift_swap(user_input):
    data = validate_confirmShiftSwap(user_input)
    if data["ok"]:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])

        #check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]
            user_id = user_from_db["_id"]

            # check if the shift swap exist
            shift_swap = db.get_shift_swap(company_id, data['swap_id'])

            if shift_swap:
                shift_swap = shift_swap['shifts_swaps'][0]
                if (shift_swap['status'] == 'wait_for_confirm'):
                    if(data['status'] == 'confirm'):

                        # search for the employees in the given shift
                        employees = db.get_employees_of_shift(company_id, shift_swap['shift_id'])

                        # switch the employees
                        employees = [shift_swap["id_employee_can"] if x==shift_swap["id_employee_ask"] else x for x in employees]

                        # update the new employes list in database
                        db.update_employees_in_shift(company_id, shift_swap["shift_id"], employees)

                        new_status = 'confirmed'
                        message = create_message_confirm(shift_swap)

                    else:
                        new_status = 'wait_for_swap'
                        doc = db.remove_employees_can_from_swap(company_id, data['swap_id'])
                        message = create_message_not_confirm(shift_swap)

                    # change the status of the shiftswap
                    db.update_status_of_swap(company_id, data['swap_id'], new_status)

                    # send message to the employees
                    send_message(message)

                    return jsonify({"ok": True, "msg": "Update swap request successfully"}), 200
                else:
                    return jsonify({"ok": False, "msg": "there is no need for confirm"}), 401
            else:
                return jsonify({"ok": False, "msg": "there is no swap with this id"}), 401
        else:
            return jsonify({"ok": False, "msg": "User don\'t have company"}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400


def create_message_not_confirm(shift_swap):
    return {
        'to': {"employees": [shift_swap['id_employee_can']]},
        'title': "Swap request denied",
        "message": "denied"
    }


def create_message_confirm(shift_swap):
    return {
        'to': {"employees": [shift_swap["id_employee_can"], shift_swap["id_employee_ask"]]},
        'title': "Swap request confirm",
        "message": "your swap request confirmed"
    }