from pymongo import MongoClient
from .schemas.login import validate_login
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
from config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']

def doLogin(userInput):
    data = validate_login(userInput)
    if data['ok']:
        data = data['data']

        #Search for user in database
        user = users_collection.find_one({'email': data['email']})
        if user and user['password'] == data['password']:
            del user['password']
            # create jwt token
            token = {'_id': user['_id'], 'email': user['email']}
            access_token = create_access_token(identity=user)
            refresh_token = create_refresh_token(identity=user)
            user['token'] = access_token
            user['refresh'] = refresh_token
            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'msg': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
