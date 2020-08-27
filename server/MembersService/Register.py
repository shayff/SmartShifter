from . import db
from .schemas.register import validate_register
from flask import jsonify
from pymongo import ReturnDocument #check if needed?
from datetime import datetime


def doRegister(user_input):
   data = validate_register(user_input)
   if data["ok"]:
      new_user = data["data"]
      new_user['email'] = new_user['email'].lower()

      result_email = db.users_collection.find_one({'email': new_user['email']})
      # [check] look like id not really work
      result_id_number = db.users_collection.find_one({'id number': new_user['id number']})
      if not result_email:
         prepare_new_user(new_user)

         # insert user to db
         db.users_collection.insert_one(new_user)
         return jsonify({'ok': True, 'msg': "user registered successfully", "id": count_id}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User with email address or id number already exists'}), 409
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(new_user['msg'])}), 400


def prepare_new_user(new_user):
   '''
   Add relevant fields for new user
   '''
   # update counter Users
   new_user_id = inc_and_get_counter()
   new_user.update({'_id': new_user_id})

   # update time created and messages
   date = datetime.now()
   new_user.update({'time_created': date.ctime()})

   # empty message
   new_user.update({'messages': []})

def inc_and_get_counter():
   doc = db.counters_collection.find_one_and_update({'_id': 'userid'}, {'$inc': {'value': 1}},
                                                     return_document=ReturnDocument.AFTER)
   return doc['value']