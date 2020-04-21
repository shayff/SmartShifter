from pymongo import MongoClient
from .schemas.register import validate_register
from flask import jsonify

cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]

def doRegister(data):
   data = validate_register(data)
   if data["ok"]:
      data=data["data"]
      data['email'] = data['email'].lower()
      result = collection.find_one({'email': data['email']})
      if result:
         return jsonify({'ok': False, 'msg': 'User with email address already exists'}), 401
      else:
         count_doc = collection.count_documents({})
         y = {"_id": count_doc + 1}
         data.update(y)
         collection.insert_one(data)
         return jsonify({'ok': True, 'msg': 'user registered successfully'}), 200

   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['message'])}), 400




