from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.MembersService.classes.user import user

def get_profile():
    '''
    This method return the profile of the logged in user
    '''
    logged_in_user = get_jwt_identity()
    user_from_db = user(logged_in_user["_id"])
    print(user_from_db.get_profile())
    return jsonify({"ok": True, 'data': user_from_db.get_profile()}), 200