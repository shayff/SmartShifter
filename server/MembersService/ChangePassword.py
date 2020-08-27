from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.ChangePassword import validate_changePassword

def doChangePassword(user_input):
    data = validate_changePassword(user_input)
    if data['ok']:
        data = data['data']

        logged_in_user = get_jwt_identity()
        #Search for user password in database
        user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']}, {"password":1})

        if data["current_password"] == user_from_db["password"]:
            db.users_collection.find_one_and_update({'_id': logged_in_user['_id']}, {"$set" : {'password': data["new_password"]}})
            return jsonify({'ok': True, 'msg': "The password changed successfully"}), 200
        else:
            return jsonify({'ok': False, 'msg': "The password entered is wrong"}), 202