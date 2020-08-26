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

def doGetSentMessages():

    list_messages = []
    current_user = get_jwt_identity()
    user = users_collection.find_one({'_id': current_user['_id']})
    messages = messages_collection.find({'from': user['_id']})

    for item in messages:
        list_messages.append(item)

    print(list_messages)
    #check if List is empty
    if not list_messages:
        return jsonify({'ok': True, 'msg': 'The messages list is empty','data': list_messages}), 204
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200