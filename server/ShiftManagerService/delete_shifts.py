from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.ShiftManagerService.schemas.deleteshift import validate_deleteshift
from .BL.shifts_manager_class import ShiftsManager

def delete_shifts(user_input):
    '''
    This method delete shift by given id, it's also check for shift_swaps request and remove them.
    '''
    data = validate_deleteshift(user_input)
    if data["ok"]:
        data = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])

        #check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]
            shifts_ids_to_delete = data["id"]
            shifts_manager = ShiftsManager(company_id)
            shifts_manager.delete_shifts(shifts_ids_to_delete)

            return jsonify({"ok": True, "msg": "delete shift successfully"}), 200
        else:
            return jsonify({"ok": False, "msg": "the company not exist"}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400