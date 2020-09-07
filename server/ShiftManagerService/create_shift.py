from server.ShiftManagerService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.CompaniesService.schemas.addshifts import validate_create_shift

def create_shift(user_input):
    data = validate_create_shift(user_input)
    if data["ok"]:
        new_shift = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user['_id'])

        #check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]

            # update id shift
            shift_id = db.inc_shifts_counter(company_id)
            new_shift.update({'id': shift_id})

            # add shift status
            new_shift.update({"status": "not_scheduled"})

            # insert to db
            db.insert_shift(company_id, new_shift)

            print(new_shift)
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400