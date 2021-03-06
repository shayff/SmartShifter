from datetime import datetime
from . import db
from flask import jsonify
from .schemas.register import validate_register

def doRegister(user_input):
   '''
   This method register new user
   '''
   data = validate_register(user_input)
   if data["ok"]:
      new_user = data["data"]
      new_user['email'] = new_user['email'].lower()

      result_email = db.get_user_by_email(new_user['email'])
      result_id_number = db.get_user_by_id_number(new_user["id_number"])

      if not result_email:
         count_id = prepare_new_user(new_user)

         # insert user to db
         db.insert_user(new_user)
         return jsonify({"ok": True, "msg": "user registered successfully", "id": count_id}), 200
      else:
         return jsonify({"ok": False, "msg": 'User with email address or id number already exists'}), 409
   else:
      return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(new_user["msg"])}), 400


def prepare_new_user(new_user):
   '''
   Add relevant fields for new user
   '''
   # update counter Users
   new_user_id = db.inc_users_counter()
   new_user.update({"_id": new_user_id})

   # update time created and messages
   date = datetime.now()
   new_user.update({'time_created': date.ctime()})

   # empty message
   new_user.update({'messages': []})
   return new_user_id