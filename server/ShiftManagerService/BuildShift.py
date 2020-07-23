from pymongo import MongoClient
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from .BL.BuildShiftLogic import buildshiftclass

MongoConfig ={
    "ConnectionString": "mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority",
    "ClusterName": "shifter_db"
}

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

def doBuildShift(data):
    dates=data['dates']
    current_user = get_jwt_identity()
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' not in result:
        return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        company_id = result['company']
        list_of_shifts = get_list_of_shifts(company_id)
        list_of_employees = get_list_of_employees(company_id)
        shifts = buildshiftclass(list_of_shifts,list_of_employees,dates)
        scheduled_shifts = shifts.buildShift()
    return jsonify({'ok': True, 'msg': 'build shift', 'data': scheduled_shifts}), 200

def get_list_of_shifts(companyId):
    company = companies_collection.find_one({'_id': companyId})
    return company['shifts']

def get_list_of_employees(companyId):
    company = companies_collection.find_one({'_id': companyId})
    return [x for x in company['employees'] if 'preference' in x]


