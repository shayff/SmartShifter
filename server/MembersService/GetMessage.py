from server import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from bson.json_util import dumps, loads


def doGetMessages():
    list_messages = []
    current_user = get_jwt_identity()
    user_in_db = db.users_collection.find_one({'_id': current_user['_id']})
    array_id_msg = user_in_db['messages']

    #Search for id_messages in all messages

    for item in array_id_msg:
        msg = db.messages_collection.find_one({'_id': item['id']})
        #add the status
        msg["status"] = item["status"]
        list_messages.append(msg)

    print(list_messages)
    #check if List is empty
    if not list_messages:
        return jsonify({'ok': True, 'msg': 'The messages list is empty','data': list_messages}), 200
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200

