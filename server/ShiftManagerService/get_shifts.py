from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .BL.ShiftsLogic import sort_shifts_by_start_time, add_full_data_of_employees_to_shifts, add_is_shift_full_field
from .BL.ShiftData import ShiftData
from .schemas.getshifts import validate_GetShifts

def get_shifts(user_input):
    '''
    This method return the shifts of company
    '''
    data = validate_GetShifts(user_input)
    if data["ok"]:
        data = data["data"]
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])
        shiftScheduled = dict()
    
        # check if user has company
        if "company" in user_from_db:

            # get the list of shifts from db
            company_id = user_from_db["company"]
            company = db.get_company(company_id)
            list_of_shifts = company["shifts"]

            # filter shifts by status (scheduled or not)
            list_of_shifts = filter_by_status(data, list_of_shifts)

            # filter by dates and add full data
            get_shift_by_dates(company_id, data, list_of_shifts, shiftScheduled, logged_in_user["_id"])

            # sort the shifts by start date
            sort_shifts_by_start_time(shiftScheduled)

            return jsonify({"ok": True, "data": shiftScheduled}), 200
        else:
            return jsonify({"ok": True, "msg": 'User don\'t have company'}), 401
    else:
        return jsonify({"ok": False, "msg": "Bad request parameters: {}".format(data["msg"])}), 400

def get_shift_by_dates(company_id, data, list_of_shifts, shiftScheduled, user_id):
    shift_data = ShiftData(company_id)
    for shift in list_of_shifts:
        dic_employees = {}
        if shift and shift["date"] >= data["start_date"] and shift["date"] <= data["end_date"]:
            add_is_asked_swap_field(shift,company_id,user_id)

            # for each employee id we get from DB the name and appened to the employees array of the shift
            add_full_data_of_employees_to_shifts(shift["employees"], shift, shift_data)

            # add the shift to our dict
            add_shift_to_shiftScheduled(shift, shiftScheduled)

            if shift["status"] == "scheduled":
                add_is_shift_full_field(shift)  # duplicate with build shift

def add_shift_to_shiftScheduled(shift, shiftScheduled):
    if shift["date"] in shiftScheduled:
        shiftScheduled[shift["date"]].append(shift)
    else:
        shiftScheduled[shift["date"]] = [shift]

def filter_by_status(data, list_of_shifts):
    if "statuses" in data and data["statuses"]:
        statuses = data["statuses"]
        list_of_shifts = [x for x in list_of_shifts if x["status"] in statuses]
    return list_of_shifts


def add_is_asked_swap_field(shift,company_id, user_id):
    if user_id in shift["employees"]:
        doc = db.get_shift_swap_by_shift_id(company_id, user_id, shift["id"])
        if doc is not None and "shifts_swaps" in doc:
            shift["is_asked_swap"] = True
        else:
            shift["is_asked_swap"] = False
    else:
        shift["is_asked_swap"] = False