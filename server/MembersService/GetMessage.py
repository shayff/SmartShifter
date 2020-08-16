
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from server.config import MongoConfig
from bson.json_util import dumps, loads

# connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']
messages_collection = db['messages']


def doGetMessages():
    list_messages = []
    current_user = get_jwt_identity()
    user_in_db = users_collection.find_one({'_id': current_user['_id']})
    array_id_msg = user_in_db['messages']
    print(array_id_msg)

    #Search for id_messages in all messages

    for item in array_id_msg:
        msg = messages_collection.find_one({'_id': item['id']})
        #add the status
        msg["status"] = item["status"]
        list_messages.append(msg)

    print(list_messages)
    #check if List is empty
    if not list_messages:
        print({'ok': True, 'msg': 'list of messages:', 'data': list_messages})
        return jsonify({'ok': True, 'msg': 'The messages list is empty'}), 200
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200

