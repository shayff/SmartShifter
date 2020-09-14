from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.removeemployees import validate_removeemployees

def remove_employees_from_company(user_input):
   '''
   This method remove employees from current company
   '''
   data = validate_removeemployees(user_input)
   if data["ok"]:
      employees_to_remove = data["data"]["employees"]
      logged_in_user = get_jwt_identity()
      user_from_db = db.get_user(logged_in_user["_id"])
      if "company" in user_from_db:
         company_id = user_from_db["company"]

         # check if the relevance employees in the company
         company_from_db = db.get_company(company_id)

         # get id's of all employees in the company
         employees_id_from_company = [employee["id"] for employee in company_from_db["employees"]]

         # look for employees we want to remove who are not in the company
         employees_not_updated = [x for x in employees_to_remove if x not in employees_id_from_company]

         # get the employees we can remove (we asked to remove and also in company)
         employees_to_remove = [x for x in employees_to_remove if x not in employees_not_updated]

         #iterate for each epmloye, remove his company id
         for employee in employees_to_remove:
            db.delete_company_field_for_user(employee)
            db.delete_employee_from_company(company_id, employee)

         return jsonify({"ok": True, "msg": 'Removed employees', 'removed': employees_to_remove, 'not removed': employees_not_updated}), 200
      else:
         return jsonify({"ok": False, "msg": 'User has no company', 'data': data}), 401
   else:
      return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(data["msg"])}), 400