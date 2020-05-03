from pymongo import MongoClient
from .schemas.addemployees import validate_addemployees
from flask import jsonify
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counters_collection = db["counters"]

def doAddEmployees(data):
   data = validate_addemployees(data)
   if data["ok"]:
      data = data["data"]
      current_user = get_jwt_identity()
      result = users_collection.find_one({'_id': current_user['_id']})
      if "company" in result:
         company_id = result["company"]
         employees = data["employees"]
         employees_not_updated = []

         #iterate for each epmloye, check if he has company and add if not
         for employe in employees:
            user_result = users_collection.find_one({"_id": employe["id"]})
            if user_result and "company" not in user_result:
               users_collection.find_one_and_update({"_id": employe["id"]}, {"$set": {"company": company_id}})
            else:
               employees_not_updated.append(employe)

         #remove employees that already have company
         employees = [x for x in employees if x not in employees_not_updated]
         print(employees)
         # update employees in the company
         companies_collection.find_one_and_update({'_id': company_id}, {"$addToSet": {'employees': {"$each": employees}}})
         return jsonify({'ok': True, 'msg': 'Added employees', 'added': employees, 'not added': employees_not_updated}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
