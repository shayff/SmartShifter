
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from server.config import MongoConfig

# connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']
messages_collection = db['messages']


def doGetMessages():
    current_user = get_jwt_identity()
    user_in_db = users_collection.find_one({'_id': current_user['_id']})
    array_id_msg = user_in_db['messages']
    list_of_messages = []

    #Search for id_messages in all messages
    for id_msg in array_id_msg:
        msg = messages_collection.find_one({'_id': id_msg})
        if msg:
            list_of_messages.append(msg)

    #check if List is empty
    if not list_of_messages:
        return jsonify({'ok': True, 'msg': 'The messages list is empty'}), 401
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'list of messages:': list_of_messages}), 401
