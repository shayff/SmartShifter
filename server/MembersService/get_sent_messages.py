from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
import datetime
import time

def doGetSentMessages():
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user['_id'])
    messages = db.messages_collection.find({'from': user_from_db['_id']})

    for item in messages:
        #messages
        employees_read = []
        for user_id in item["to"]:

            # check for each user he read the message and if do add his name
            doc = db.users_collection.find_one({'_id': user_id},{"messages": {"$elemMatch": {"id": item["_id"]}}, "first_name": 1, "last_name": 1})
            status = doc["messages"][0]["status"]
            if(status == "read"):
                user_full_name = doc["first_name"] + " " + doc["last_name"]
                employees_read.append(user_full_name)

        item["employees_read"] = employees_read
        list_messages.append(item)

    #sort the messages
    list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"], "%a %b %d %H:%M:%S %Y"), reverse=True)
    print(list_messages)

    #check if List is empty
    if list_messages:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200
    else:
        return jsonify({'ok': True, 'msg': 'The messages list is empty', 'data': list_messages}), 204