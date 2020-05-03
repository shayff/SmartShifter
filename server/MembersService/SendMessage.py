
from datetime import datetime
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from server.config import MongoConfig
from .schemas.sendmessage import validate_sendMessage

# connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']
messages_collection = db['messages']
counter = db['counters']

def doSendMessage(data):
    data = validate_sendMessage(data)
    current_user = get_jwt_identity()
    array_id_not_exists = []
    array_to_send = []
    notexist = False
    if data["ok"]:
        # Check if all users exist
        print(data)
        data = data['data']
        print(data)
        for userid in data['to']:
            result = users_collection.find_one({'_id': userid})
            if not result:
                notexist = True
                array_id_not_exists.append(userid)
            else:
                array_to_send.append(userid)

        if notexist:
            return jsonify({'ok': False, 'msg': 'User not exists:', 'id': array_id_not_exists}), 401

        else:
            # update counter message id
            doc = counter.find_one_and_update({'_id': 'messageid'}, {'$inc': {'value': 1}},
                                              return_document=ReturnDocument.AFTER)
            countId = doc['value']
            data.update({"_id": countId})

            # update time created
            date = datetime.now()
            data.update({'time_created': date.ctime()})

            # update status - ("read" / "unread")
            data.update({'status': 'unread'})

            # update from in message
            data.update({'from': current_user['_id']})

            # insert to db.users_collection
            messages_collection.insert_one(data)

            # insert to db.users_collection
            for userid in array_to_send:
                users_collection.update({'_id': userid}, {'$push': {'messages': {'$each': [data['_id']],
                                                                                 '$position': 0}}})

            return jsonify({'ok': True, 'msg': 'The message sending successfully!'}), 401

    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
