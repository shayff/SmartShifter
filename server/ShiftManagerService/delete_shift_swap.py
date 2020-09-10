from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def delete_shift_swap(swap_id):
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])

    #check if user has company
    if "company" in user_from_db:
        company_id = user_from_db["company"]
        swap_id = int(swap_id) #it's came as char from url
        doc = db.companies_collection.find_one({"_id": company_id},
                                                      {"shifts_swaps": {"$elemMatch": {"id": swap_id}}})
        if "shifts_swaps" in doc:
            shift_swap = doc["shifts_swaps"][0]

            if(shift_swap["id_employee_ask"] == logged_in_user["_id"]):
                db.companies_collection.update_one({"_id": company_id},{'$pull': {'shifts_swaps': {"id": swap_id}}})
                return jsonify({"ok": True, "msg": 'delete shift swap successfully'}), 200
            else:
                return jsonify({"ok": False, "msg": 'you are not the owner of shift swap'}), 401
        else:
            return jsonify({"ok": False, "msg": 'shift_swap not exist'}), 401
    else:
        return jsonify({"ok": False, "msg": 'the company not exist'}), 401