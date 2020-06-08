from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from config import MongoConfig

#connect to database
from server.MembersService.schemas.updateProfile import validate_updateProfile

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']


def doUpdateProfile(data):
    data = validate_updateProfile(data)
    loggedinUser = get_jwt_identity()
    print("loggedinUser")
    print(loggedinUser)
    if data['ok']:
        data = data["data"]
        data['email'] = data['email'].lower()
        result = users_collection.find_one({'email': data['email']})
        print("result")
        print(result)
        if result and (result['_id'] != loggedinUser['_id']):
            return jsonify({'ok': False, 'msg': 'User with email address already exists'}), 401
        current_user = users_collection.find_one_and_update({'_id': loggedinUser['_id']}, {'$set': data})
        return jsonify({'ok': True, 'msg': ' Update Profile successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
