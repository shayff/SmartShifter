from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.updateemployee import validate_updateemployee

#
#   NEED TO FIX THE SEARCH OF EMPLOYEE
#

def doUpdateEmployee(user_input):
   data = validate_updateemployee(user_input)
   if data["ok"]:
      employee = data["data"]

      #check if user has company
      logged_in_user = get_jwt_identity()
      user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
      if "company" in user_from_db:
         company_id = user_from_db["company"]

         #search if the given employee in the company
         company_from_db = db.companies_collection.find_one({'_id': company_id})
         employee_to_update = next((x for x in company_from_db["employees"] if x["id"] == employee["id"]), None)

         if(employee_to_update):

            # update the relevant fields in the object
            for key in employee:
               employee_to_update[key] = employee[key]

            # update object in mongo
            db.companies_collection.update({'_id': company_id, 'employees.id': employee_to_update["id"]},
                                                            {'$set': {'employees.$': employee_to_update}})
            return jsonify({'ok': True, 'msg': 'Updated successfully'}), 200
         else:
            return jsonify({'ok': False, 'msg': 'User is not in company'}), 400
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
