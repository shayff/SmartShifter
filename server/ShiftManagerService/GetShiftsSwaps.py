from pymongo import MongoClient
from config import MongoConfig
from .schemas.getshiftsswaps import validate_GetShiftsSwaps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity


#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig["ClusterName"]]
companies_collection = db["companies"]
users_collection = db["users"]

def doGetShiftsSwaps(userInput):
    data = validate_GetShiftsSwaps(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        user = users_collection.find_one({"_id": current_user["_id"]})
        statuses = data['statuses']

        # check if user has company
        if "company" not in user:
            return jsonify({"ok": False, "msg": "User has no company"}), 401
        else:
            company_id = user["company"]
            company = companies_collection.find_one({'_id': company_id})
            swaps = company["shifts_swaps"]
            print(swaps[0])
            swaps_filtered = [x for x in swaps if x["status"] in statuses]
            return jsonify({"ok": True, "data": swaps_filtered}), 200
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400

