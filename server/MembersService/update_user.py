from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.MembersService.schemas.updateProfile import validate_updateProfile

def update_user(user_input):
    '''
    This method update user in db
    '''
    data = validate_updateProfile(user_input)
    logged_in_user = get_jwt_identity()
    if data["ok"]:
        data = data["data"]
        data['email'] = data['email'].lower()
        result = db.get_user_by_email(data['email'])

        if result == None or result["_id"] == logged_in_user["_id"]:
            db.update_user(logged_in_user["_id"], data)
            return jsonify({"ok": True, "msg": ' Update Profile successfully'}), 200
        else:
            return jsonify({"ok": False, "msg": 'User with email address already exists'}), 401
    else:
        return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(data["msg"])}), 400