from pymongo import MongoClient
from .schemas.create import validate_create
from flask import jsonify
from pymongo import ReturnDocument
from datetime import datetime
from server.config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counters_collection = db["counters"]

def doCreate(user_input):
   data = validate_create(user_input)
   if data["ok"]:
      company_to_add = data["data"]
      logged_in_user = get_jwt_identity()
      result = users_collection.find_one({'_id': logged_in_user['_id']})
      if "company" not in result:
         # update counter Companies
         doc = counters_collection.find_one_and_update({"_id": "companyid"}, {"$inc": {"value": 1}},
                                                       return_document=ReturnDocument.AFTER)
         id_counter = doc['value']
         company_to_add.update({"_id": id_counter})

         # update time created
         date = datetime.now()
         company_to_add.update({"time_created": date.ctime()})

         # add the current manager and employees:
         company_to_add.update({"managers": [logged_in_user['_id']], "employees": []})

         # add shifts_counter
         company_to_add.update({'shifts_counter': 0})

         # add shifts_swaps_counter
         company_to_add.update({'shifts_swaps_counter': 0})

         # add an array of shift swaps
         company_to_add.update({'shifts_swaps':[]})

         # add empty shift array
         company_to_add.update({"shifts": []})

         # add empty prefence_from_manager
         company_to_add.update({"prefence_from_manager": {}})

         # add roles array
         if "roles" not in company_to_add:
            company_to_add.update({"roles": []})

         # insert to db
         companies_collection.insert_one(company_to_add)

         # update user company
         users_collection.find_one_and_update({'_id': logged_in_user['_id']}, { "$set": {'company':id_counter}})

         print(company_to_add)
         return jsonify({'ok': True, 'msg': 'company created successfully', 'data': company_to_add}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has already company'}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
