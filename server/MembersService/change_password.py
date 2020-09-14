from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.ChangePassword import validate_changePassword

def change_password(user_input):
    '''
    This method change user password
    '''
    data = validate_changePassword(user_input)
    if data["ok"]:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user_password(logged_in_user["_id"])

        if data["current_password"] == user_from_db["password"]:
            db.update_user_password(logged_in_user["_id"], data["new_password"])
            return jsonify({"ok": True, "msg": "The password changed successfully"}), 200
        else:
            return jsonify({"ok": False, "msg": "The password entered is wrong"}), 202