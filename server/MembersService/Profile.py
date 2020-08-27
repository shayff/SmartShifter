from server import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity


def doProfile():
    logged_in_user = get_jwt_identity()

    # search for user profie in database
    user = db.users_collection.find_one({'_id': logged_in_user['_id']})
    update_company_field(user)
    del user['password']
    print(user)
    return jsonify({'ok': True, 'data': user}), 200


def update_company_field(user):
    '''
    This method take care of company fields in user profile
    '''
    user["is_has_company"] = "company" in user
    if "company" in user:
        company_id = user['company']
        company = db.companies_collection.find_one({'_id': company_id})
        user["company name"] = company["company name"]