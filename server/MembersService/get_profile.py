from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_profile():
    '''
    This method return the profile of the logged in user
    '''
    logged_in_user = get_jwt_identity()

    # search for user profie in database
    user_from_db = db.get_user(logged_in_user["_id"])

    # remove unnecessary fields
    del user_from_db["password"]

    update_company_field(user_from_db)

    print(user_from_db)
    return jsonify({"ok": True, 'data': user_from_db}), 200


def update_company_field(user):
    '''
    This method take care of company fields in user profile
    '''
    user["is_has_company"] = "company" in user
    if "company" in user:
        company_id = user['company']
        company = db.get_company(company_id)
        user["company_name"] = company["company_name"]