from .user import user
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def get_messages():
    '''
    This method return the messages of the current user
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = user(logged_in_user["_id"])
    list_messages = user_from_db.get_messages()
    print(list_messages)

    # check if List is empty
    if not list_messages:
        return jsonify({"ok": True, "msg": "The messages list is empty","data": list_messages}), 200
    else:
        return jsonify({"ok": True, "msg": "list of messages:", "data": list_messages}), 200