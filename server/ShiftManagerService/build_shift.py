from . import db
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
import pandas as pd
import numpy as np
from datetime import datetime
from .BL.BuildShiftLogic import build_shift_class
from .BL.ShiftsLogic import sort_shifts_by_start_time, add_full_data_of_employees_to_shifts, add_is_shift_full_field
from .BL.ShiftData import ShiftData
from .schemas.build_shift import validate_buildShift

def build_shift(user_input):
    '''
    This method build the shift scheduled by all given prefernce and relevant data.
    '''
    data = validate_buildShift(user_input)
    if data["ok"]:
        data = data['data']

        # init num of employee scheduled
        count_of_employee_scheduled = 0

        # create list of dates we want to work with
        dates = create_list_of_dates(data)

        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])
        if "company" in user_from_db:
            company_id = user_from_db["company"]

            #init data
            shift_data = ShiftData(company_id)
            list_of_shifts = get_list_of_shifts(company_id,dates)
            total = get_total_employees_count_needed(list_of_shifts, dates)

            #check if there are pre_scheduled data
            if "pre_scheduled" in data:
                update_pre_scheduled(list_of_shifts, data)

            list_of_employees = get_list_of_employees(company_id)
            shifts = build_shift_class(list_of_shifts, list_of_employees, dates)
            scheduled_shifts = shifts.buildShift()

            # add the employees that already work to the data
            add_employee_that_already_work(list_of_shifts, scheduled_shifts)

            # add Full_data information about shifts and employees
            shift_scheduled_to_display = dict()
            print(scheduled_shifts)
            company = db.companies_collection.find_one({"_id": company_id})
            if(scheduled_shifts):
                for shift_id in scheduled_shifts:
                    employees_id = scheduled_shifts[shift_id]

                    #count_of_employee_scheduled how many employees scheduled
                    count_of_employee_scheduled += len(employees_id)

                    #find the shift details in the list_of_shifts
                    shift = next(x for x in list_of_shifts if x["id"] == shift_id)

                    add_full_data_of_employees_to_shifts(employees_id, shift, shift_data)
                    add_is_shift_full_field(shift)
                    add_empty_shifts_by_date(shift, shift_scheduled_to_display)

            # sort the shifts
            sort_shifts_by_start_time(shift_scheduled_to_display)

            # compute the success rate
            success_rate = get_success_rate(count_of_employee_scheduled, total)
            return jsonify({"ok": True, "msg": "build shift", "success_rate": success_rate, "data": scheduled_shifts,
                            "full_data": shift_scheduled_to_display}), 200
        else:
            return jsonify({"ok": False, "msg": 'User don\'t have company'}), 401
    else:
        return jsonify({"ok": False, "msg": 'Bad request parameters: {}'.format(data["msg"])}), 400


def create_list_of_dates(data):
    dates = pd.date_range(start=data["start_date"], end=data["end_date"])
    dates = pd.Series(dates.format())
    return dates


def get_success_rate(count, total):
    if(total == 0):
        return 0
    else:
        return int(count / total * 100)

def add_empty_shifts_by_date(shift, shift_Scheduled_to_display):
    '''
    If there is shift we didn't scheduled this method will add it.
    '''
    if shift['date'] in shift_Scheduled_to_display:
        shift_Scheduled_to_display[shift['date']].append(shift)
    else:
        shift_Scheduled_to_display[shift['date']] = [shift]

def add_employee_that_already_work(list_of_shifts, scheduled_shifts):
    for shift in list_of_shifts:
        if shift["id"] in scheduled_shifts:
            scheduled_shifts[shift["id"]] += (shift["employees"])
        else:
            scheduled_shifts[shift["id"]] = shift["employees"]

def get_list_of_shifts(company_id, dates):
    company = db.get_company(company_id)
    shifts = [x for x in company['shifts'] if x['date'] in dates.tolist()]
    return shifts

def get_list_of_employees(company_id):
    company = db.get_company(company_id)
    return [x for x in company['employees'] if 'preference' in x]

def update_pre_scheduled(list_of_shifts, data):
    for ps in data["pre_scheduled"]:
        for index, shift in enumerate(list_of_shifts):
            if shift["id"] == ps["shift_id"]:
                list_of_shifts[index]["employees"].append(ps["employee_id"])
    return

def get_total_employees_count_needed(list_of_shifts, dates):
    total = 0
    for shift in list_of_shifts:
        total += shift["amount"]
    return total

