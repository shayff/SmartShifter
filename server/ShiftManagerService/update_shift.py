from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.ShiftManagerService.schemas.updateshift import validate_updateshift

def update_shift(user_input):
    '''
    This method update relevant shift
    '''
    data = validate_updateshift(user_input)
    if data["ok"]:
        shift_to_update = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])

        if "company" in user_from_db:
            company_id = user_from_db["company"]

            # find the relevant shift in db
            shift_id = shift_to_update["id"]
            shift = db.get_shift(copany_id, shift_id)

            # update only the field that we need to update
            for key, value in shift.items():
                if key in shift_to_update:
                    shift[key] = shift_to_update[key]

            # update in database
            doc = db.update_shift(company_id, shift_id, shift)
            print(doc)
            return jsonify({"ok": True, "msg": "Update Shift successfully"}), 200
        else:
            return jsonify({"ok": False, "msg": "User has no company"}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400