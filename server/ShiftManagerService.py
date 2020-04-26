from datetime import time, datetime, timedelta

from flask import jsonify
from pymongo import MongoClient
from server.config import MongoConfig

company_id = 2


#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]

# get list of shifts
def get_list_of_shifts():
    company =companies_collection.find_one({'_id': company_id})
    list_of_shifts = company['shifts']
    return list_of_shifts


def getPartOfDayToTime():
    company = companies_collection.find_one({'_id': company_id})
    PartOfDayToTimeDict = dict()
    for daypart in company["day parts"]:
        PartOfDayToTimeDict[daypart["id"]] = {"start time": datetime.strptime(daypart["start time"], "%H:%M"), "end time": datetime.strptime(daypart["end time"])}
    return PartOfDayToTimeDict


# get list of employees
def get_list_of_employees():
    company =companies_collection.find_one({'_id': company_id})
    list_of_employees = company['employees']
    return list_of_employees

def getThePrefenceByDay(employeePrefence,day):
    #return the employee prefence of given day
    for x in employeePrefence:
        if(x["day"]==day):
            return x
    return None

def isEmployeeCanWork(shift,employee):
    prefnceForTheShiftDay = getThePrefenceByDay(employee["prefence"], shift["day"])
    return shift["day part"] in prefnceForTheShiftDay["prefer"] or shift["day part"] in prefnceForTheShiftDay["available"]

def rankShift(shift,dictOfEmployees):
    for employee in shift["employees_can_work"]:
        print(dictOfEmployees[employee["id"]])
        #print(employee)
    return

def dictFromListOfEmployees(list_of_employees):
    result = dict()
    for employee in list_of_employees:
        result[employee["id"]] = employee
    return result

def buildShifts():
    # fot each shift, add the employee that "available" or "prefer"
    listOfCompleteShift = []
    list_of_shifts = get_list_of_shifts()
    list_of_employees = get_list_of_employees()
    dictOfEmployees = dictFromListOfEmployees(list_of_employees)
    for shift in list_of_shifts:
        shift["employees_can_work"] = []
        for employee in list_of_employees:
            if isEmployeeCanWork(shift,employee):
                shift["employees_can_work"].append({"id": employee["id"], "rank":0})

    # remove the shifts that have the right amount of people
    for shift in list_of_shifts:
        if shift["amount"] >= len(shift["employees_can_work"]):
            listOfCompleteShift.append(shift)
            list_of_shifts.remove(shift)

    print(listOfCompleteShift)
    print(list_of_shifts)

    #while there are shifts with "available" or "prefer" employee
    for shift in list_of_shifts:
        rankShift(shift,dictOfEmployees)
        # rank each employee match to a shift

        # scehdule the employee with the higest rank

        # remove the shift
    return


buildShifts()