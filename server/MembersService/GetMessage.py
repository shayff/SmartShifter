
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
    current_user = get_jwt_identity()
    user_in_db = users_collection.find_one({'_id': current_user['_id']})
    array_id_msg = user_in_db['messages']

    #Search for id_messages in all messages
    msg = messages_collection.find({'_id': {'$in': array_id_msg}})
    msg = loads(dumps(msg))

    #check if List is empty
    if not msg:
        return jsonify({'ok': True, 'msg': 'The messages list is empty'}), 200
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': msg}), 200
