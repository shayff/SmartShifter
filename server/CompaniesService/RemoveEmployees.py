from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.removeemployees import validate_removeemployees

def doRemoveEmployees(user_input):
   data = validate_removeemployees(user_input)
   if data["ok"]:
      data = data["data"]

      #check if user has company
      logged_in_user = get_jwt_identity()
      user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
      if "company" in user_from_db:
         company_id = user_from_db["company"]
         employees = data["employees"]

         # check if the relevance employees in the company
         company_from_db = db.companies_collection.find_one({'_id': company_id})
         employees_id_list = [employee["id"] for employee in company_from_db["employees"]]
         employees_not_updated = [x for x in employees if x not in employees_id_list]
         employees = [x for x in employees if x not in employees_not_updated]

         #iterate for each epmloye, remove his company id
         for employe in employees:
            db.users_collection.find_one_and_update({"_id": employe}, {"$unset": {"company": ""}})
            db.companies_collection.find_one_and_update({"_id": company_id}, {"$pull": {"employees": {"id": employe}}})

         return jsonify({'ok': True, 'msg': 'Removed employees', 'removed': employees, 'not removed': employees_not_updated}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has no company', 'data': data}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400