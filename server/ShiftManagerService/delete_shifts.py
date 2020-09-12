from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.ShiftManagerService.schemas.deleteshift import validate_deleteshift

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
            shift_ids = data["id"]

            # for each shift if exist delete it
            for shift_id in shift_ids:
                if is_shift_exist(company_id, shift_id):
                    delete_shift(company_id, shift_id)

            return jsonify({"ok": True, "msg": 'delete shift successfully'}), 200
        else:
            return jsonify({"ok": False, "msg": 'the company not exist'}), 401
    else:
        return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(data["msg"])}), 400


def delete_shift(company_id, shift_id):
    # delete relevant swaps
    db.companies_collection.update_one({"_id": company_id}, {'$pull': {'shifts_swaps': {'shift_id': shift_id}}})
    # delete the shift
    db.companies_collection.update_one({"_id": company_id}, {'$pull': {'shifts': {"id": shift_id}}})


def is_shift_exist(company_id, shift_id):
    doc = db.companies_collection.find_one({"_id": company_id},
                                        {"shifts": {"$elemMatch": {"id": shift_id}}, "shifts.employees": 1})
    return "shifts" in doc