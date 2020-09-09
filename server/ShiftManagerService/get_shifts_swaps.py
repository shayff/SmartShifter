from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.getshiftsswaps import validate_GetShiftsSwaps

def doGetShiftsSwaps(user_input):
    data = validate_GetShiftsSwaps(user_input)
    if data['ok']:
        data = data['data']
        logged_in_user = get_jwt_identity()
        user_from_db = db.users_collection.find_one({"_id": logged_in_user["_id"]})
        statuses = data['statuses']

        # check if user has company
        if "company" in user_from_db:
            company_id = user_from_db["company"]
            company = db.companies_collection.find_one({'_id': company_id})

            #filter
            shifts_swaps = company["shifts_swaps"]
            swaps_filtered = [x for x in shifts_swaps if x["status"] in statuses]

            #updates the names and the shift detailes for each swap
            arr_to_del = []
            for swap in swaps_filtered:

                #update the name of employees
                update_full_name_of_employee(swap, "employee_ask")

                if "id_employee_can" in swap:
                    update_full_name_of_employee(swap, "employee_can")

                #update the shift details
                doc = db.companies_collection.find_one({'_id': company_id}, {"shifts": {"$elemMatch" : {"id":swap["shift_id"]}}})
                doc = doc["shifts"][0]

                #if its employee or manager
                if (logged_in_user["_id"] not in company['managers']):
                    # find job
                    employees = company['employees']
                    obj_emp = next((x for x in company['employees'] if x['id'] == logged_in_user['_id']), None)
                    job_type = obj_emp["job_type"]

                    #filter by job, create arr to remove
                    if  doc["job_type"] in job_type:
                        swap.update({"shift_details": doc})
                    else:
                        arr_to_del.append(swap)

                    for swap in arr_to_del:
                        to_del = next((x for x in swaps_filtered if x == swap), None)
                        swaps_filtered.remove(to_del)
                else:
                    swap.update({"shift_details": doc})

            swaps_filtered = sorted(swaps_filtered,  key=lambda swap: swap["time_created"])

            return jsonify({"ok": True,  "msg": "There are no shift swap ", "data": swaps_filtered}), 200
        else:
            return jsonify({"ok": False, "msg": "User has no company"}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400


# its was update_full_name_of_employee_can
def update_full_name_of_employee(swap, field):
    '''
    add full name of employee_can or employee_ask
    '''
    employee_from_db = db.users_collection.find_one({'_id': swap["id_"+field]}, {"first_name", "last_name"})
    swap["name_"+field] = employee_from_db["first_name"] + " " + employee_from_db["last_name"]