from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.updateshift import validate_updateshift

def doUpdateShift(user_input):
    data = validate_updateshift(user_input)
    if data["ok"]:
        shift_to_update = data["data"]

        #check if user has company
        logged_in_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})

        if "company" in user_from_db:
            #update data of relevant company
            company_id = user_from_db["company"]
            shift_id = shift_to_update['id']

            shift = db.companies_collection.find_one({'_id': company_id},
                                                {"shifts": {"$elemMatch": {"id": shift_id}}})
            shift = shift["shifts"][0]
            #Update only the field that we need
            for key, value in shift.items():
                if key in shift_to_update:
                    shift[key] = shift_to_update[key]
            #update in database
            doc = db.companies_collection.update_one({'_id': company_id, 'shifts.id': shift_id}, {'$set':
                                                                                                   {'shifts.$': shift}})
            print(doc)
            return jsonify({'ok': True, 'msg': 'Update Shift successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

