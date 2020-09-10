import datetime, time
from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_sent_messages():
    '''
    This method return the messages sent by logged in user
    '''
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user["_id"])
    messages = db.get_messages_from_user(user_from_db["_id"])

    for msg in messages:
        # for each message we add full user details

        users_full_data = []
        for user_id in msg["to"]:

            # for each uesr id we add his full data
            user_data_message = create_user_data_for_msg(msg, user_id)
            users_full_data.append(user_data_message)

        msg["to"] = users_full_data
        list_messages.append(msg)

    #sort the messages
    list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"],
                                                                                         "%a %b %d %H:%M:%S %Y"),
                                                                                                        reverse=True)
    print(list_messages)

    #check if List is empty
    if list_messages:
        return jsonify({"ok": True, "msg": 'list of messages:', 'data': list_messages}), 200
    else:
        return jsonify({"ok": True, "msg": 'The messages list is empty', 'data': list_messages}), 204


def create_user_data_for_msg(message, user_id):
    user_data_message = db.get_user_details_of_message(user_id, message["_id"])
    status = user_data_message["messages"][0]["status"]
    del user_data_message["messages"]
    user_data_message["full_name"] = user_data_message["first_name"] + " " + user_data_message["last_name"]
    del user_data_message["first_name"]
    del user_data_message["last_name"]
    user_data_message["is_read"] = status == "read"
    return user_data_message