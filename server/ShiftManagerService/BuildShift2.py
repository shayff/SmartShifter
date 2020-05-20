from pymongo import MongoClient
#from config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request, jsonify
from datetime import time, datetime, timedelta
import numpy as np

from server.ShiftManagerService.BL.BuildShiftLogic import ShiftBuilderLogic

MongoConfig ={
    "ConnectionString": "mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority",
    "ClusterName": "shifter_db"
}

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

#rank of availble/prefer
rank_of_prefer = 3
rank_of_available = 1
rank_of_not = 0

'''
def doBuildShift():
    current_user = get_jwt_identity()
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' not in result:
        return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        companyId = result['company']

    shifts = buildShifts(companyId)
    return jsonify({'ok': True, 'msg': 'build shift', 'data': shifts}), 200
'''

def build_shift_start_by_day_list(listOfShifts):
    shift_start_by_day_list = []
    current_day_start = 0
    for shift_index in range(len(listOfShifts)):
        if (listOfShifts[shift_index]['day'] != listOfShifts[current_day_start]['day']):
            current_day_start=shift_index
        shift_start_by_day_list.append(current_day_start)
    return shift_start_by_day_list

def build_worker_amount_in_shift_list(listOfShifts):
    list_worker_amount_in_shift = []
    for shift in listOfShifts:
        list_worker_amount_in_shift.append(shift['amount'])
    return list_worker_amount_in_shift

def build_rank_matrix(companyId):
    # for each shift, add the employee that "available" or "prefer"
    listOfCompleteShift = []

    listOfShifts = get_list_of_shifts(companyId)
    listOfEmployees = get_list_of_employees(companyId)

    #create shift difficulty matrix
    shift_difficulty_array=[]
    for shift in listOfShifts:
        shift_difficulty_array.append(shift['difficulty'])
    difficulty_matrix=np.vstack([shift_difficulty_array]*len(listOfEmployees))

    #create employee rank matrix
    employee_rank_array = []
    for employee in listOfEmployees:
        employee_rank_array.append(employee['rank'])
    emp_rank_matrix=np.vstack([employee_rank_array]*len(listOfShifts))
    emp_rank_matrix=emp_rank_matrix.transpose()

    rank_matrix = emp_rank_matrix + difficulty_matrix

    #add the rank of employee prefence for a shift
    for y in range(len(listOfEmployees)):
        for x in range(len(listOfShifts)):

            #look for the prefence of the employee for the current shift
            day = listOfShifts[x]['day']
            prefence_of_employee_to_shift = next((z for z in listOfEmployees[y]['preference'] if z['day'] == day), None)

            #if there are prefence for the current shift check if it's 'prefer' or 'available' or 'not'
            if(prefence_of_employee_to_shift != None):
                if(listOfShifts[x]['day part'] in prefence_of_employee_to_shift['prefer']):
                    rank_to_add = rank_of_prefer
                elif(listOfShifts[x]['day part'] in prefence_of_employee_to_shift['available']):
                    rank_to_add = rank_of_available
                else:
                    rank_to_add = rank_of_not
            else:
                rank_to_add = rank_of_not

            #add the current rank for the rank matrix
            rank_matrix[y, x] += rank_to_add

    return rank_matrix

def build_available_matrix(companyId):
    listOfShifts = get_list_of_shifts(companyId)
    listOfEmployees = get_list_of_employees(companyId)

    available_matrix = np.zeros((len(listOfEmployees),len(listOfShifts)))

    # add the rank of employee prefence for a shift
    for y in range(len(listOfEmployees)):
        for x in range(len(listOfShifts)):

            # look for the prefence of the employee for the current shift
            day = listOfShifts[x]['day']
            prefence_of_employee_to_shift = next((z for z in listOfEmployees[y]['preference'] if z['day'] == day), None)

            # if there are prefence for the current shift check if it's 'prefer' or 'available' or 'not'
            if (prefence_of_employee_to_shift != None):
                if (listOfShifts[x]['day part'] in prefence_of_employee_to_shift['prefer']):
                    rank_to_add = 1
                elif (listOfShifts[x]['day part'] in prefence_of_employee_to_shift['available']):
                    rank_to_add = 1
                else:
                    rank_to_add = 0
            else:
                rank_to_add = 0

            # add the current rank for the rank matrix
            available_matrix[y, x] += rank_to_add
    return available_matrix

# get list of shifts
def get_list_of_shifts(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_shifts = company['shifts']
    return list_of_shifts

# get list of employees
def get_list_of_employees(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_employees = company['employees']
    return list_of_employees

compid=2
#print(build_rank_matrix(1))
list_of_shifts = get_list_of_shifts(compid)
matrix = build_available_matrix(compid)
rank_matrix= build_rank_matrix(compid)
shift_start_by_day = build_shift_start_by_day_list(list_of_shifts)
amount_of_worker_in_shift = build_worker_amount_in_shift_list(list_of_shifts)

print(matrix)
print(rank_matrix)
print(shift_start_by_day)
print(amount_of_worker_in_shift)


a = ShiftBuilderLogic(matrix, rank_matrix, amount_of_worker_in_shift, shift_start_by_day)

print(a.BuildShift())
