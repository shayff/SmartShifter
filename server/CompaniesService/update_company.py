from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.update import validate_update


def update_company(user_input):
    '''
    This method update company information
    '''
    data = validate_update(user_input)
    if data["ok"]:
        company_update_details = data["data"]
        current_user = get_jwt_identity()
        user_from_db = db.get_user(current_user["_id"])

        if "company" in user_from_db:
            company_id = user_from_db["company"]
            db.update_company(company_id, company_update_details)

            return jsonify({"ok": True, "msg": "Update Company successfully"}), 200
        else:
            return jsonify({"ok": False, "msg": 'User has no company', "data": company_update_details}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400