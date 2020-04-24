import json

from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from config import MongoConfig

#connect to database
from server.MembersService.schemas.register import validate_register
from server.MembersService.schemas.updateProfile import validate_updateProfile

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
collection = db["users"]


def doUpdateProfile(data):
    data = validate_updateProfile(data)
    current_user = get_jwt_identity()
    if data["ok"]:
        current_user = collection.find_one_and_update({'_id': current_user['_id']}, {'$set': data['data']})
        return jsonify({'ok': True, 'msg': ' Update Profile successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
