from pymongo import MongoClient
from server.config import MongoConfig
from flask import jsonify
from .schemas.getshifts import validate_GetShifts
from flask_jwt_extended import get_jwt_identity
from .BL.ShiftsLogic import sort_shifts_by_start_time, add_full_data_of_employees_to_shifts
from .BL.ShiftData import ShiftData

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


def doGetShifts(userInput):
    data = validate_GetShifts(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        user = users_collection.find_one({'_id': current_user['_id']})
        shiftScheduled = dict()
    
        # check if user has company
        if 'company' in user:
            company_id = user['company']
            company = companies_collection.find_one({'_id': company_id})
            list_of_shifts = company['shifts']
            shift_data = ShiftData(company_id)

            # filter shifts by status
            if("statuses" in data):
                statuses = data["statuses"]
                list_of_shifts = [x for x in list_of_shifts if x["status"] in statuses]

            for shift in list_of_shifts:
                dic_employees = {}
                if shift['date']>=data['start_date'] and shift['date']<=data['end_date']:

                    #For each employee id we get frmo DB the name and appened to the employees array of the shift
                    add_full_data_of_employees_to_shifts(shift["employees"], shift, shift_data)

                    if shift['date'] in shiftScheduled:
                        shiftScheduled[shift['date']].append(shift)
                    else:
                        shiftScheduled[shift['date']] = [shift]

                    #sort the shifts by start date
                    sort_shifts_by_start_time(shiftScheduled)

            return jsonify({'ok': True, 'data': shiftScheduled}), 200
        else:
            return jsonify({'ok': True, 'msg': 'User don\'t have company'}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400



