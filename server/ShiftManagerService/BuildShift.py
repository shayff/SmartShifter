from pymongo import MongoClient
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from .BL.BuildShiftLogic import buildshiftclass
from .schemas.buildshift import validate_buildShift
import pandas as pd
import numpy as np
from datetime import datetime

MongoConfig ={
    "ConnectionString": "mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority",
    "ClusterName": "shifter_db"
}

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

def doBuildShift(userInput):
    data = validate_buildShift(userInput)
    if data['ok']:
        data = data['data']

        #create list of dates we want to work with
        dates = pd.date_range(start=data['start_date'], end=data['end_date'])
        dates = pd.Series(dates.format())

        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})
        if 'company' not in result:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
        else:
            company_id = result['company']
            list_of_shifts = get_list_of_shifts(company_id,dates)

            #check if there are pre_scheduled data
            if "pre_scheduled" in data:
                update_pre_scheduled(list_of_shifts, data)

            list_of_employees = get_list_of_employees(company_id)
            shifts = buildshiftclass(list_of_shifts,list_of_employees,dates)
            scheduled_shifts = shifts.buildShift()

            #Add Full_data information about shifts and employees
            shift_Scheduled_to_display = dict()
            company = companies_collection.find_one({'_id': company_id})
            if(scheduled_shifts):
                for shift_id in scheduled_shifts:
                    employees_id = scheduled_shifts[shift_id]
                    shift = next(x for x in list_of_shifts if x['id'] == shift_id)
                    if shift['date'] >= data['start_date'] and shift['date'] <= data['end_date']:
                        # For each employee id we get frmo DB the name and appened to the employees array of the shift
                        employee_full_details_array = []
                        for id_employee in employees_id:
                            employee_db = users_collection.find_one({'_id': id_employee}, {'first name', 'last name'})
                            employee_full_details_array.append(employee_db)
                        shift['employees'] = employee_full_details_array

                        if shift['date'] in shift_Scheduled_to_display:
                            shift_Scheduled_to_display[shift['date']].append(shift)
                        else:
                            shift_Scheduled_to_display[shift['date']] = [shift]


        return jsonify({'ok': True, 'msg': 'build shift', 'data': scheduled_shifts,'Full_data': shift_Scheduled_to_display}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

def get_list_of_shifts(companyId,dates):
    company = companies_collection.find_one({'_id': companyId})
    shifts = [x for x in company['shifts'] if x['date'] in dates.tolist()]
    return shifts

def get_list_of_employees(companyId):
    company = companies_collection.find_one({'_id': companyId})
    return [x for x in company['employees'] if 'preference' in x]

def update_pre_scheduled(list_of_shifts, data):
    for ps in data["pre_scheduled"]:
        for index, shift in enumerate(list_of_shifts):
            if shift["id"] == ps["shift_id"]:
                list_of_shifts[index]["employees"].append(ps["employee_id"])
    return