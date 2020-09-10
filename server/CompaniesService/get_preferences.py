from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_preferences():
    '''
    This method return the prefernces the managaer ask for
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user['_id'])

    if "company" in user_from_db:
        company_id = user_from_db["company"]
        company_from_db = db.get_company(company_id)

        preferences = company_from_db["prefence_from_manager"]

        # get the minmum shift manager asked for
        if("settings" in company_from_db and "shifts_required_from_emp" in company_from_db["settings"]:
            minimum_shifts_required = company_from_db["settings"]["shifts_required_from_emp"]
        else:
            minimum_shifts_required = None

        if preferences:
            return jsonify({"ok": True, "msg": "Successfully", "data": preferences, "minimum_shifts": minimum_shifts_required}), 200
        else:
            return jsonify({"ok": True, "msg": 'There is no need to submit shifts now', 'data': preferences, "minimum_shifts": minimum_shifts_required}), 200
    else:
        return jsonify({"ok": False, "msg": "User has no company"}), 401
