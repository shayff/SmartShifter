from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.CompaniesService.classes.company import company


def get_company():
    '''
    This method retuen the profile of the curret user company
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])

    if "company" in user_from_db:

        # get data of relevante company
        company_id = user_from_db["company"]
        company_from_db = company(company_id)

        return jsonify({"ok": True, "data": new_company.get_profile()}), 200
    else:
        return jsonify({"ok": False, "msg": "User has no company", 'data': data}), 401
