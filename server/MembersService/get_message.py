import datetime
from server.MembersService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_messages():
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])
    messages_ids = user_from_db['messages']

    # for eacch message we get the message and add full details
    for msg_id in messages_ids:
        msg = db.messages_collection.find_one({"_id": msg_id["id"]})
        add_full_data_to_message(msg, msg_id, user_from_db)
        list_messages.append(msg)

    #sort the messages
    list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"], "%a %b %d %H:%M:%S %Y"), reverse=True)

    print(list_messages)
    # check if List is empty
    if not list_messages:
        return jsonify({"ok": True, "msg": 'The messages list is empty','data': list_messages}), 200
    else:
        return jsonify({"ok": True, "msg": 'list of messages:', 'data': list_messages}), 200


def add_full_data_to_message(msg, msg_id, user_from_db):
    msg["status"] = msg_id["status"]
    msg["sender_name"] = user_from_db["first_name"] + " " + user_from_db["last_name"]