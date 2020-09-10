from datetime import datetime
from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.create import validate_create

def create_company(user_input):
   '''
   This method let you create a new company
   '''
   data = validate_create(user_input)
   if data["ok"]:
      new_company = data["data"]
      logged_in_user = get_jwt_identity()
      user_from_db = db.get_user(logged_in_user['_id'])

      if "company" not in user_from_db:

         # update counter Companies
         new_company_id = db.inc_company_counter()
         new_company.update({"_id": new_company_id})

         prepare_new_company(logged_in_user, new_company)

         # insert company to db
         db.insert_company(new_company)

         # update user company field
         db.update_user_company(new_company_id, logged_in_user['_id'])

         print(new_company)
         return jsonify({'ok': True, 'msg': 'company created successfully', 'data': new_company}), 200
      else:
         return jsonify({'ok': False, 'msg': 'User has already company'}), 401
   else:
      return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400


def prepare_new_company(logged_in_user, new_company):
   # update time created
   date = datetime.now()
   new_company.update({"time_created": date.ctime()})

   # add the current manager and employees:
   new_company.update({"managers": [logged_in_user['_id']], "employees": []})

   # add shifts_counter
   new_company.update({'shifts_counter': 0})

   # add shifts_swaps_counter
   new_company.update({'shifts_swaps_counter': 0})

   # add an array of shift swaps
   new_company.update({'shifts_swaps': []})

   # add empty shift array
   new_company.update({"shifts": []})

   # add empty prefence_from_manager
   new_company.update({"prefence_from_manager": {}})

   # add roles array
   if "roles" not in new_company:
      new_company.update({"roles": []})
