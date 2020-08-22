from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from server.config import MongoConfig
from .schemas.updateshift import validate_updateshift


cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]
users_collection = db["users"]

def doUpdateShift(data):
    data = validate_updateshift(data)
    if data["ok"]:
        data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        if "company" in result:
            #update data of relevant company
            company_id = result["company"]
            print(company_id)
            shift_id = data['id']
            print(shift_id)
            shift = companies_collection.find_one({'_id': company_id},
                                                {"shifts": {"$elemMatch": {"id": shift_id}}})
            print(shift)
            shift = shift["shifts"][0]

            #Update only the field that we need
            for key, value in shift.items():
                if key in data:
                    shift[key] = data[key]

            #update in database
            doc = companies_collection.update_one({'_id': company_id, 'shifts.id': shift_id}, {'$set':
                                                                                                   {'shifts.$': shift}})

            return jsonify({'ok': True, 'msg': 'Update Shift successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

