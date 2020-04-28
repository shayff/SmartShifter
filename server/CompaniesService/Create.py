from pymongo import MongoClient
from .schemas.create import validate_create
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counter = db["counters"]

def doCreate(data):
   data = validate_create(data)
   if data["ok"]:
      data=data["data"]
      current_user = get_jwt_identity()
      result = users_collection.find_one({'_id': current_user['_id']})
      if "company" in result:
         return jsonify({'ok': False, 'msg': 'User has already company'}), 401
      else:
         # update counter Companies
         doc = counter.find_one_and_update({"_id":"companyid"}, {"$inc": {"value": 1}}, return_document=ReturnDocument.AFTER)
         countId = doc['value']
         data.update({"_id": countId})

         # update time created
         date = datetime.now()
         data.update({"managers":[current_user['_id']],"employees":[],"time_created": date.ctime()})

         # insert to db
         companies_collection.insert_one(data)

         # update user company
         users_collection.find_one_and_update({'_id':current_user['_id']},{ "$set": {'company':countId}})
         return jsonify({'ok': True, 'msg': 'company created successfully', 'data': data}), 200
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400