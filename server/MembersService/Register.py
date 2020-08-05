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

def doRegister(data):
   data = validate_register(data)
   if data["ok"]:
      data = data["data"]
      data['email'] = data['email'].lower()
      result = usersCollection.find_one({'email': data['email']})
      if result:
         return jsonify({'ok': False, 'msg': 'User with email address already exists'}), 401
      else:
         # update counter Users
         doc = counters_collection.find_one_and_update({'_id': 'userid'}, {'$inc': {'value': 1}}, return_document=ReturnDocument.AFTER)
         count_id = doc['value']
         data.update({'_id': count_id})

         # update time created and messages
         date = datetime.now()
         data.update({'time_created': date.ctime()})
         data.update({'messages': []})

         # insert to db
         usersCollection.insert_one(data)
         return jsonify({'ok': True, 'msg': "user registered successfully", "id": count_id}), 200

   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400