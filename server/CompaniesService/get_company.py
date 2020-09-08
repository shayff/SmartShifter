from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity


def get_company():
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])
    if "company" in user_from_db:

        # get data of relevante company
        company_id = user_from_db["company"]
        company_from_db = db.get_company(company_id)
        del company_from_db["employees"]
        del company_from_db["shifts"]
        del company_from_db["shifts_swaps"]

        return jsonify({'ok': True, "data": company_from_db}), 200
    else:
        return jsonify({'ok': False, "msg": "User has no company", 'data': data}), 401
