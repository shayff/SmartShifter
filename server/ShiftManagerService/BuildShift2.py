from pymongo import MongoClient
#from config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request, jsonify
from datetime import time, datetime, timedelta
import numpy as np

MongoConfig ={
    "ConnectionString": "mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority",
    "ClusterName": "shifter_db"
}

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']



def buildShifts(companyId):
    # fot each shift, add the employee that "available" or "prefer"
    listOfCompleteShift = []

    listOfShifts = getListOfShifts(companyId)
    listOfEmployees = getListOfEmployees(companyId)
    #print(listOfShifts)
    #print("####")
    #print(listOfEmployees)

    #create shift difficulty matrix
    shift_difficulty_array=[]
    for shift in listOfShifts:
        shift_difficulty_array.append(shift['difficulty'])
    difficulty_matrix=np.vstack([shift_difficulty_array]*len(listOfEmployees))

    #create employee rank matrix
    employee_rank_array = []
    for employee in listOfEmployees:
        employee_rank_array.append(employee['rank'])
    rank_matrix=np.vstack([employee_rank_array]*len(listOfShifts))
    rank_matrix=rank_matrix.transpose()
    print(rank_matrix)

    '''
    dictOfEmployees = dictFromListOfEmployees(listOfEmployees)
    
    #for each employee update how many shift he asked for, and add a place to count how many he got
    updateShiftCount(dictOfEmployees)

    for shift in listOfShifts:
        shift['employees_can_work'] = []
        for employee in listOfEmployees:
            if isEmployeeCanWork(shift, employee):
                shift['employees_can_work'].append({'id': employee['id'], 'rank': 0})

    # while there are shifts with "available" or "prefer" employee
    while listOfShifts:
        # remove the shifts that have the right amount of people

        isChanged = True
        while isChanged:
            isChanged = False
            for shift in listOfShifts:
                if shift['amount'] >= len(shift['employees_can_work']):
                    scheduleAllEmployeesToShift(shift, dictOfEmployees, listOfShifts)
                    # pass shift to completed
                    del shift['employees_can_work']
                    listOfCompleteShift.append(shift)
                    listOfShifts.remove(shift)
                    isChanged = True
                    break

        # check if there is no more shifts
        if not listOfShifts:
            break

        # rank each employee match to a shift
        for shift in listOfShifts:
            rankShift(shift, dictOfEmployees)

        # schedule the employee with the highest rank
        shiftToSched, employeeToSched = getEmployeeByHigestRank(listOfShifts)
        scheduleEmployeeToShift(employeeToSched, shiftToSched, dictOfEmployees, listOfShifts)

        if shiftToSched['amount'] >= len(shiftToSched['employees_can_work']) or shiftToSched['amount'] == len(shiftToSched['employees']):
            print('test')
            # pass shift to completed
            del shift['employees_can_work']
            listOfCompleteShift.append(shift)
            listOfShifts.remove(shift)
    print('shift that did not completed:')
    print(listOfShifts)
    print('list of finish shifts:')
    print(listOfCompleteShift)
    return listOfCompleteShift
'''

# get list of shifts
def getListOfShifts(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_shifts = company['shifts']
    return list_of_shifts

# get list of employees
def getListOfEmployees(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_employees = company['employees']
    return list_of_employees


buildShifts(1)