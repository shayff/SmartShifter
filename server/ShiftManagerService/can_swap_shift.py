from datetime import datetime
from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.can_shift_swap import validate_CanShiftSwap

def can_swap_shift(user_input):
    '''
    This method set user that say he can switch
    '''
    data = validate_CanShiftSwap(user_input)
    if data["ok"]:
        data = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])

        #check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]
            shift_swap = db.get_shift_swap(company_id, data["swap_id"])
            status = shift_swap["shifts_swaps"][0]["status"]
            shift_id = shift_swap["shifts_swaps"][0]["shift_id"]

            if status == "wait_for_swap":
                # update the name and id of employee can swap
                doc = db.set_employee_can_swap(company_id, logged_in_user["_id"], data['swap_id'])

                # update status to 'wait_for_confirm'
                doc = db.update_status_of_swap(company_id, data["swap_id"], "wait_for_confirm")

                return jsonify({"ok": True, "msg": "update shift swap request successfully"}), 200
            else:
                return jsonify({"ok": False, "msg": "the status is not wait_for_swap"}), 401
        else:
            return jsonify({"ok": False, "msg": 'User don\'t have company'}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400