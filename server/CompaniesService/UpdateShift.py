from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from server.config import MongoConfig
from .schemas.updateshift import validate_updateshift


cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doUpdateShift(user_input):
    data = validate_updateshift(user_input)
    if data["ok"]:
        shift_to_update = data["data"]

        #check if user has company
        logged_in_user = get_jwt_identity()
        result = users_collection.find_one({'_id': logged_in_user['_id']})

        if "company" in result:
            #update data of relevant company
            company_id = result["company"]
            shift_id = shift_to_update['id']
            print(shift_to_update)
            print(shift_id)
            shift = companies_collection.find_one({'_id': company_id},
                                                {"shifts": {"$elemMatch": {"id": shift_id}}})
            shift = shift["shifts"][0]
            print("from db")
            print(shift)
            #Update only the field that we need
            for key, value in shift.items():
                if key in shift_to_update:
                    shift[key] = shift_to_update[key]
            print("updated")
            print(shift)
            #update in database
            doc = companies_collection.update_one({'_id': company_id, 'shifts.id': shift_id}, {'$set':
                                                                                                   {'shifts.$': shift}})
            print(doc)
            return jsonify({'ok': True, 'msg': 'Update Shift successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

