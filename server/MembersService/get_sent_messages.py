from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def doGetSentMessages():
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
    messages = db.messages_collection.find({'from': user_from_db['_id']})

    for item in messages:
        list_messages.append(item)

    print(list_messages)
    list_messages = sorted(list_messages, key=lambda message: message["time_created"])

    #check if List is empty
    if list_messages:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200
    else:
        return jsonify({'ok': True, 'msg': 'The messages list is empty', 'data': list_messages}), 204