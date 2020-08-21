from pymongo import MongoClient
from .schemas.register import validate_register
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime
from server.config import MongoConfig

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
usersCollection = db["users"]
counters_collection = db["counters"]

def doRegister(user_input):
   data = validate_register(user_input)
   if data["ok"]:
      new_user = data["data"]
      new_user['email'] = new_user['email'].lower()
      result_email = usersCollection.find_one({'email': new_user['email']})
      result_id_number = usersCollection.find_one({'id number': new_user['id number']})
      if not result_email:
         # update counter Users
         doc = counters_collection.find_one_and_update({'_id': 'userid'}, {'$inc': {'value': 1}}, return_document=ReturnDocument.AFTER)
         count_id = doc['value']
         new_user.update({'_id': count_id})

         # update time created and messages
         date = datetime.now()
         new_user.update({'time_created': date.ctime()})
         new_user.update({'messages': []})

         # insert to db
         usersCollection.insert_one(new_user)
         return jsonify({'ok': True, 'msg': "user registered successfully", "id": count_id}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User with email address or id number already exists'}), 409
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(new_user['msg'])}), 400