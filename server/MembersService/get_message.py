from server.MembersService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def doGetMessages():
    list_messages = []
    logged_in_user = get_jwt_identity()
    user_from_db = db.get_user(logged_in_user['_id'])
    messages_ids = user_from_db['messages']

    #Search for id_messages in all messages
    for msg_id in messages_ids:
        msg = db.messages_collection.find_one({'_id': msg_id['id']})

        #add the status
        msg["status"] = msg_id["status"]
        msg["sender_name"] = user_from_db["first name"] + " " + user_from_db["last name"]
        list_messages.append(msg)

    #sort the messages
    list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"], "%a %b %d %H:%M:%S %Y"), reverse=True)

    print(list_messages)
    #check if List is empty
    if not list_messages:
        return jsonify({'ok': True, 'msg': 'The messages list is empty','data': list_messages}), 200
    else:
        return jsonify({'ok': True, 'msg': 'list of messages:', 'data': list_messages}), 200