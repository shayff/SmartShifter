from .schemas.login import validate_login
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
from .. import db

def doLogin(user_input):
    data = validate_login(user_input)
    if data['ok']:
        data = data['data']

        #Search for user in database
        user = db.users_collection.find_one({'email': data['email']})
        if user and user['password'] == data['password']:
            del user['password']
            # create jwt token
            token = {"_id": user['_id'], 'email': user['email']}
            access_token = create_access_token(identity=user)
            refresh_token = create_refresh_token(identity=user)
            user["token"] = access_token
            user["refresh"] = refresh_token
            user["is_has_company"] = "company" in user
            print(user)

            #Check if user is manager of company
            if('company' in user):
                company_id = user['company']
                company = db.companies_collection.find_one({'_id': company_id})
                if (company and user['_id'] in company['managers']):
                    user['isManagerOfCompany'] = "true"
                else:
                    user['isManagerOfCompany'] = "false"
            else:
                user['isManagerOfCompany'] = "false"

            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'msg': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
