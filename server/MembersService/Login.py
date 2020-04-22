from pymongo import MongoClient
from .schemas.login import validate_login
from flask import jsonify
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
#connect to database
cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]

def doLogin(userInput):
    data=validate_login(userInput)
    if data['ok']:
        data = data['data']
        user = collection.find_one({'email': data['email']})
        if user and user['password'] == data['password']:
            del user['password']
            access_token = create_access_token(identity=data)
            refresh_token = create_refresh_token(identity=data)
            user['token'] = access_token
            user['refresh'] = refresh_token
            return jsonify({'ok': True, 'data': user}), 200
        else:
            return jsonify({'ok': False, 'msg': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
