from pymongo import MongoClient
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from .schemas.setshiftsschedule import validate_setshiftsschedule
from ..config import MongoConfig


#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


def doSetShiftsSchedule(data):
     # data = validate_setshiftsschedule(data)
     # if data["ok"]:
     #    data = data["data"]

        #check if user has company
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        if "company" in result:
            #update data of relevant company
            company_id = result["company"]
            shifts = data['data']
            for key, value in shifts.items():
                doc = companies_collection.update_one({'_id': company_id, 'shifts.id': int(key)},
                                                      {'$set': {'shifts.$.employees': value}})
            if doc.modified_count > 0:
                return jsonify({'ok': True, 'msg': 'Update shift successfully'}), 200
            else:
                return jsonify({'ok': False, 'msg': 'shift not exist'}), 400

        else:
            return jsonify({'ok': False, 'msg': 'User has no company'}), 401





