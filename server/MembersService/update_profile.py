from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.MembersService.schemas.updateProfile import validate_updateProfile


def doUpdateProfile(user_input):
    data = validate_updateProfile(user_input)
    logged_in_user = get_jwt_identity()
    if data["ok"]:
        data = data["data"]
        data['email'] = data['email'].lower()
        result = db.users_collection.find_one({'email': data['email']})

        if result and (result["_id"] != logged_in_user["_id"]):
            return jsonify({"ok": False, "msg": 'User with email address already exists'}), 401

        db.users_collection.find_one_and_update({"_id": logged_in_user["_id"]}, {'$set': data})
        return jsonify({"ok": True, "msg": ' Update Profile successfully'}), 200
    else:
        return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(data["msg"])}), 400