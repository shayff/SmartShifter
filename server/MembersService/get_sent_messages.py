from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from bson.json_util import dumps, loads
from server import db

def doGetSentMessages():
    list_messages = []
    current_user = get_jwt_identity()
    user = db.users_collection.find_one({'_id': current_user['_id']})
    messages = db.messages_collection.find({'from': user['_id']})

    for item in messages:
        list_messages.append(item)

    print(list_messages)
    #check if List is empty
    if list_messages:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200
    else:
        return jsonify({'ok': True, 'msg': 'The messages list is empty', 'data': list_messages}), 204