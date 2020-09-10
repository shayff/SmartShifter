from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
import datetime
import time

def doGetSentMessages():
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])
    messages = db.messages_collection.find({'from': user_from_db["_id"]})

    for item in messages:
        #messages
        user_full_data = []
        for user_id in item["to"]:
            # check for each user he read the message and if do add his name
            user_data_message = create_user_data_for_msg(item, user_id)
            user_full_data.append(user_data_message)

        item["to"] = user_full_data
        list_messages.append(item)

    #sort the messages
    list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"], "%a %b %d %H:%M:%S %Y"), reverse=True)
    print(list_messages)

    #check if List is empty
    if list_messages:
        return jsonify({"ok": True, "msg": 'list of messages:', 'data': list_messages}), 200
    else:
        return jsonify({"ok": True, "msg": 'The messages list is empty', 'data': list_messages}), 204


def create_user_data_for_msg(message, user_id):
    user_data_message = db.users_collection.find_one({"_id": user_id},
                                                     {"messages": {"$elemMatch": {"id": message["_id"]}}, "first_name": 1,
                                                      "last_name": 1})
    status = user_data_message["messages"][0]["status"]
    del user_data_message["messages"]
    user_data_message["full_name"] = user_data_message["first_name"] + " " + user_data_message["last_name"]
    del user_data_message["first_name"]
    del user_data_message["last_name"]
    user_data_message["is_read"] = status == "read"
    return user_data_message