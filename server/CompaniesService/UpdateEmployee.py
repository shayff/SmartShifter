from pymongo import MongoClient
from .schemas.updateemployee import validate_updateemployee
from flask import jsonify
from server.config import MongoConfig
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
      employee = data["data"]

      #check if user has company
      logged_in_user = get_jwt_identity()
      result = users_collection.find_one({'_id': logged_in_user['_id']})
      if "company" in result:
         company_id = result["company"]

         #search if the given employee in the company
         company = companies_collection.find_one({'_id': company_id})
         employee_to_update = next((x for x in company["employees"] if x["id"] == employee["id"]), None)

         if(employee_to_update):

            # update the relevant fields in the object
            for key in employee:
               employee_to_update[key] = employee[key]

            # update object in mongo
            companies_collection.update({'_id': company_id, 'employees.id': employee_to_update["id"]},
                                                            {'$set': {'employees.$': employee_to_update}})
         else:
             return jsonify({'ok': False, 'msg': 'User is not in company'}), 400

         return jsonify({'ok': True, 'msg': 'Updated successfully'}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
