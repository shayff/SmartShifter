from . import db
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
from .schemas.login import validate_login

def doLogin(user_input):
    data = validate_login(user_input)
    if data['ok']:
        data = data['data']

        # search for user in database
        user_from_db = db.users_collection.find_one({'email': data['email']})

        if user_from_db and user_from_db['password'] == data['password']:
            del user_from_db['password']

            # create jwt token
            create_and_add_token(user_from_db)

            user_from_db["is_has_company"] = "company" in user_from_db

            # check if user is manager of company
            if('company' in user_from_db):
                company_id = user_from_db['company']
                company = db.get_company(company_id)
                if (company and user_from_db['_id'] in company['managers']):
                    user_from_db['isManagerOfCompany'] = "true"
                else:
                    user_from_db['isManagerOfCompany'] = "false"
            else:
                user_from_db['isManagerOfCompany'] = "false"

            print(user_from_db)
            return jsonify({'ok': True, 'data': user_from_db}), 200
        else:
            return jsonify({'ok': False, 'msg': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400




def create_and_add_token(user_from_db):
    token = {"_id": user_from_db['_id'], 'email': user_from_db['email']}
    access_token = create_access_token(identity=user_from_db)
    refresh_token = create_refresh_token(identity=user_from_db)
    user_from_db["token"] = access_token
    user_from_db["refresh"] = refresh_token