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

            list_of_shifts = get_list_of_shifts(company_id)

            #check if there are pre_scheduled data
            if "pre_scheduled" in data:
                update_pre_scheduled(list_of_shifts, data)

            list_of_employees = get_list_of_employees(company_id)
            shifts = buildshiftclass(list_of_shifts,list_of_employees,dates)
            scheduled_shifts = shifts.buildShift()
        return jsonify({'ok': True, 'msg': 'build shift', 'data': scheduled_shifts}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

def get_list_of_shifts(companyId):
    company = companies_collection.find_one({'_id': companyId})
    return company['shifts']

def get_list_of_employees(companyId):
    company = companies_collection.find_one({'_id': companyId})
    return [x for x in company['employees'] if 'preference' in x]

def update_pre_scheduled(list_of_shifts, data):
    for ps in data["pre_scheduled"]:
        for index, shift in enumerate(list_of_shifts):
            if shift["id"] == ps["shift_id"]:
                list_of_shifts[index]["employees"].append(ps["employee_id"])
    return