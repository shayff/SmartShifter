from server.CompaniesService import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from server.CompaniesService.schemas.addshifts import validate_addshifts
from pymongo import ReturnDocument


def doAddShifts(user_input):
    data = validate_addshifts(user_input)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        logged_in_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({'_id': logged_in_user['_id']})
        if "company" in user_from_db:
            #update data of relevant company
            company_id = user_from_db["company"]

            # update counter shifts in company
            doc = db.companies_collection.find_one_and_update({'_id': company_id}, {'$inc': {'shifts_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)
            # update id shift
            shift_id = doc['shifts_counter']
            data.update({'id': shift_id})

            # add shift status
            data.update({"status": "not_scheduled"})

            # insert to db
            db.companies_collection.find_one_and_update({'_id': company_id}, {'$push': {'shifts': data}})

            print(data)
            return jsonify({'ok': True, 'msg': 'Update Company successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400