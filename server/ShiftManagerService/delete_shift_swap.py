from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def delete_shift_swap(swap_id):
    '''
    This method delete shift swap
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])

    if "company" in user_from_db:
        company_id = user_from_db["company"]
        company = db.get_company(company_id)
        doc = db.get_shift_swap(company_id, swap_id)

        if "shifts_swaps" in doc:
            shift_swap = doc["shifts_swaps"][0]

            # check if the user want to delete the swap if mangaer or the employee who open the swap
            if shift_swap["id_employee_ask"] == logged_in_user["_id"] or logged_in_user["_id"] in company["managers"]:
                db.delete_shift_swap(company_id, swap_id)
                return jsonify({"ok": True, "msg": "delete shift swap successfully"}), 200
            else:
                return jsonify({"ok": False, "msg": "you are not the owner of shift swap"}), 401
        else:
            return jsonify({"ok": False, "msg": "shift_swap not exist"}), 401
    else:
        return jsonify({"ok": False, "msg": "the company not exist"}), 401