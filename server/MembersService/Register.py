from pymongo import MongoClient
from .schemas.register import validate_register
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime

cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]
counter = db["counters"]


def doRegister(data):
   data = validate_register(data)
   if data["ok"]:
      data=data["data"]
      data['email'] = data['email'].lower()
      result = collection.find_one({'email': data['email']})
      if result:
         return jsonify({'ok': False, 'msg': 'User with email address already exists'}), 401
      else:
         # update counter Users
         doc = counter.find_one_and_update({}, {"$inc": {"value": 1}}, return_document=ReturnDocument.AFTER)
         countId = doc['value']
         data.update({"_id": countId})

         # update time created
         date = datetime.now()
         data.update({"time_created": date.ctime()})

         # insert to db
         collection.insert_one(data)
         return jsonify({'ok': True, 'msg': 'user registered successfully'}), 200

   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
