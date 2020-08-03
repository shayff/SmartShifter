from pymongo import MongoClient
from .schemas.login import validate_login
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
from config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
usersCollection = db['users']
companies_collection = db["companies"]


def doLogin(userInput):
    data = validate_login(userInput)
    if data['ok']:
        data = data['data']

        #Search for user in database
        user = usersCollection.find_one({'email': data['email']})
        if user and user['password'] == data['password']:
            del user['password']
            # create jwt token
            token = {'_id': user['_id'], 'email': user['email']}
            access_token = create_access_token(identity=user)
            refresh_token = create_refresh_token(identity=user)
            user['token'] = access_token
            user['refresh'] = refresh_token

            #Check if user is manager of company
            if('company' in user):
                company_id = user['company']
                company = companies_collection.find_one({'_id': company_id})
                if (user['_id'] in company['managers']):
                    user['hasCompany'] = "True"
                else:
                    user['hasCompany'] = "False"
            else:
                user['hasCompany'] = "False"

            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'msg': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
