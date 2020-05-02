from pymongo import MongoClient
from server.config import MongoConfig
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request, jsonify
from datetime import time, datetime, timedelta

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

def doBuildShift():
    current_user = get_jwt_identity()
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' not in result:
        return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        companyId = result['company']
    shifts = buildShifts(companyId)
    return jsonify({'ok': True, 'msg': 'build shift', 'data': shifts}), 200


def buildShifts(companyId):
    # fot each shift, add the employee that "available" or "prefer"
    listOfCompleteShift = []
    listOfShifts = getListOfShifts(companyId)
    listOfEmployees = getListOfEmployees(companyId)
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



# get list of shifts
def getListOfShifts(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_shifts = company['shifts']
    return list_of_shifts

'''
def getPartOfDayToTime(companyId):
    company = companies_collection.find_one({'_id': companyId})
    PartOfDayToTimeDict = dict()
    for daypart in company['day parts']:
        PartOfDayToTimeDict[daypart['id']] = {'start time': datetime.strptime(daypart['start time'], '%H:%M'), 'end time': datetime.strptime(daypart['end time'])}
    return PartOfDayToTimeDict
'''

# get list of employees
def getListOfEmployees(companyId):
    company =companies_collection.find_one({'_id': companyId})
    list_of_employees = company['employees']
    return list_of_employees

def getThepreferenceByDay(employeepreference, day):
    #return the employee preference of given day
    for x in employeepreference:
        if(x['day'] == day):
            return x
    return None

def isEmployeeCanWork(shift,employee):
    prefnceForTheShiftDay = getThepreferenceByDay(employee['preference'], shift['day'])
    return shift['day part'] in prefnceForTheShiftDay['prefer'] or shift['day part'] in prefnceForTheShiftDay['available']

def rankShift(shift,dictOfEmployees):
    for employee in shift['employees_can_work']:
        rank = 0
        for employepreferenceOfDay in dictOfEmployees[employee['id']]['preference']:

            #check if employee prefer or available to the shift
            if employepreferenceOfDay['day'] == shift['day']:
                if shift['day part'] in employepreferenceOfDay['prefer']:
                    rank += 3
                elif shift['day part'] in employepreferenceOfDay['available']:
                    rank += 1
        #add the employee rank given by manager
        rank += dictOfEmployees[employee['id']]['rank']

        #add the shift rank
        rank += shift['difficulty']

        #add the
        rank += dictOfEmployees[employee['id']]['count of given preference']-dictOfEmployees[employee['id']]['count of shift scheduled']

        employee['rank'] = rank
    return

def dictFromListOfEmployees(list_of_employees):
    result = dict()
    for employee in list_of_employees:
        result[employee['id']] = employee
    return result

def updateShiftCount(dictOfEmployees):
    for key in dictOfEmployees:
        preferCount = 0
        availableCount = 0
        for preferenceOfDay in dictOfEmployees[key]['preference']:
            preferCount += len(preferenceOfDay['prefer'])
            availableCount += len(preferenceOfDay['available'])
        dictOfEmployees[key]['count of given preference'] = preferCount + availableCount
        dictOfEmployees[key]['count of shift scheduled'] = 0
    return

def getEmployeeByHigestRank(listOfShifts):
    maxRank = float('-inf')
    maxRankEmployee = None
    for shift in listOfShifts:
        for employee in shift['employees_can_work']:
            if employee['rank'] > maxRank:
                maxRank = employee['rank']
                maxRankEmployee = employee
                maxShift = shift
    return maxShift, maxRankEmployee

def scheduleAllEmployeesToShift(shift, dictOfEmployees, listOfShifts):
    while(shift['employees_can_work']):
        scheduleEmployeeToShift(shift['employees_can_work'][0], shift, dictOfEmployees, listOfShifts)
    return

def scheduleEmployeeToShift(employee, shiftToSchedule, dictOfEmployees, listOfShifts):
    dictOfEmployees[employee['id']]['count of shift scheduled'] += 1
    for shift in listOfShifts:
        if shift['day'] == shiftToSchedule['day']:
            shift['employees_can_work'].remove(employee)
    shiftToSchedule['employees'].append(employee['id'])
    return



