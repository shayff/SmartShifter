from pymongo import MongoClient
from server.config import MongoConfig
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

            #filter
            shifts_swaps = company["shifts_swaps"]
            swaps_filtered = [x for x in shifts_swaps if x["status"] in statuses]

            #updates the names and the shift detailes for each swap
            arr_to_del = []
            for swap in swaps_filtered:

                #update the name of employees
                doc = users_collection.find_one({'_id': swap["id_employee_ask"]},{"first name","last name"})
                swap["name_employee_ask"] = doc["first name"] + " " + doc["last name"]
                if "id_employee_can" in swap:
                    doc = users_collection.find_one({'_id': swap["id_employee_can"]}, {"first name", "last name"})
                    swap["name_employee_can"] = doc["first name"] + " " + doc["last name"]

                #update the shift details
                doc = companies_collection.find_one({'_id': company_id},{"shifts": { "$elemMatch" : {"id":swap["shift_id"]}}} )
                print("doc:")
                print(doc)
                doc = doc["shifts"][0]
                print(doc)
                print(swaps_filtered )
                #if its emplotee or manager
                if (current_user["_id"] not in company['managers']):
                    # find job
                    employees = company['employees']
                    obj_emp = next((x for x in company['employees'] if x['id'] == current_user['_id']), None)
                    job_type = obj_emp['job type']

                    #filter by job, create arr to remove
                    if  doc['job type'] in job_type:
                        swap.update({"shift_details": doc})
                    else:
                        arr_to_del.append(swap)

                    for swap in arr_to_del:
                        to_del =next((x for x in swaps_filtered if x == swap), None)
                        print(to_del)
                        swaps_filtered.remove(to_del)

                else:
                    swap.update({"shift_details": doc})

                print(swaps_filtered)
            return jsonify({"ok": True, "data": swaps_filtered}), 200
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400

