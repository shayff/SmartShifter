from pymongo import MongoClient
from .schemas.updateemployee import validate_updateemployee
from flask import jsonify
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]
counters_collection = db["counters"]

#
#   NEED TO FIX THE SEARCH OF EMPLOYEE
#

def doUpdateEmployee(data):
   data = validate_updateemployee(data)
   if data["ok"]:
      data = data["data"]

      #check if user has company
      current_user = get_jwt_identity()
      result = users_collection.find_one({'_id': current_user['_id']})
      if "company" in result:
         company_id = result["company"]
         employee = data["employee"]

         # check if the relevance employees in the company
         company = companies_collection.find_one({'_id': company_id})
         if employee in company["employees"]:
             message = companies_collection.find_one_and_update({'_id': company_id, 'employees.id': employee},
                                                            {'$addFields': {'employees.$': data['data']}})
         else:
             return jsonify({'ok': False, 'msg': 'User is not in company'}), 400

         return jsonify({'ok': True, 'msg': 'Removed employees', 'removed': employees, 'not removed': employees_not_updated}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
