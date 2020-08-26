from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .. import db

def doProfile():
    logged_in_user = get_jwt_identity()
    #Search for user in database
    user = db.users_collection.find_one({'_id': logged_in_user['_id']})
    user["is_has_company"] = "company" in user
    if user['company']:
        company_id = user['company']
        company = db.companies_collection.find_one({'_id': company_id})
        user["company name"] = company["company name"]


    del user['password']
    print(user)
    return jsonify({'ok': True, 'data': user}), 200