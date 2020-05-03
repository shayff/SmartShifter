from pymongo import MongoClient
from .schemas.removeemployees import validate_removeemployees
from flask import jsonify
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counters_collection = db["counters"]

def doRemoveEmployees(data):
   data = validate_removeemployees(data)
   if data["ok"]:
      data = data["data"]

      #check if user has company
      current_user = get_jwt_identity()
      result = users_collection.find_one({'_id': current_user['_id']})
      if "company" in result:
         company_id = result["company"]
         employees = data["employees"]

         # check if the relevance employees in the company
         company = companies_collection.find_one({'_id': company_id})
         employees_id_list = [employee["id"] for employee in company["employees"]]
         employees_not_updated = [x for x in employees if x not in employees_id_list]
         employees = [x for x in employees if x not in employees_not_updated]

         #iterate for each epmloye, remove his company id
         for employe in employees:
            users_collection.find_one_and_update({"_id": employe}, {"$unset": {"company": ""}})
            companies_collection.find_one_and_update({"_id": company_id}, {"$pull": {"employees": {"id": employe}}})

         return jsonify({'ok': True, 'msg': 'Removed employees', 'removed': employees, 'not removed': employees_not_updated}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
