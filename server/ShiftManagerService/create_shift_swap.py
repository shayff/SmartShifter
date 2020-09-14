from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.askshiftswap import validate_askShiftSwap
from datetime import datetime

def doAskShiftSwap(user_input):
    '''
    This method create a new shift swap
    '''
    data = validate_askShiftSwap(user_input)
    if data["ok"]:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])

        #check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]

            # update shifts_swaps id
            doc = db.inc_shifts_swaps_counter(company_id)

            # check if the user is assigned to this shift
            shifts = doc["shifts"]
            shift = [x for x in shifts if x["id"] == data["shift_id"]]
            if logged_in_user["_id"] in shift[0]["employees"]:

                prepare_shift_swap(data, doc, logged_in_user)

                # insert to db
                db.insert_shift_swap(company_id, data)

                return jsonify({"ok": True, "msg": 'Created shift swap request successfully'}), 200
            else:
                return jsonify({"ok": False, "msg": "wrong shift id, You're not in this shift"}), 401
        else:
            return jsonify({"ok": False, "msg": 'User don\'t have company'}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400

def prepare_shift_swap(data, doc, logged_in_user):
    # update counter shifts swaps id
    shifts_swaps_id = doc['shifts_swaps_counter']
    data.update({"id": shifts_swaps_id})
    # update the employee ask for
    data.update({"id_employee_ask": logged_in_user["_id"]})
    # update time created
    date = datetime.now()
    data.update({"time_created": date.ctime()})
    # add status
    data.update({"status": "wait_for_swap"})
