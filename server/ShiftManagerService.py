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
def get_list_of_employees(company_id):
    company =companies_collection.find_one({'_id': company_id})
    list_of_employees = company['employees']
    return list_of_employees

def getThePrefenceByDay(employeePrefence, day):
    #return the employee prefence of given day
    for x in employeePrefence:
        if(x["day"] == day):
            return x
    return None

def isEmployeeCanWork(shift,employee):
    prefnceForTheShiftDay = getThePrefenceByDay(employee["prefence"], shift["day"])
    return shift["day part"] in prefnceForTheShiftDay["prefer"] or shift["day part"] in prefnceForTheShiftDay["available"]

def rankShift(shift,dictOfEmployees):
    for employee in shift["employees_can_work"]:
        rank=0
        for employePrefenceOfDay in dictOfEmployees[employee["id"]]["prefence"]:

            #check if employee prefer or available to the shift
            if employePrefenceOfDay["day"] == shift["day"]:
                if shift["day part"] in employePrefenceOfDay["prefer"]:
                    rank += 3
                elif shift["day part"] in employePrefenceOfDay["available"]:
                    rank += 1
        #add the employee rank given by manager
        rank+=dictOfEmployees[employee["id"]]["rank"]

        #add the
        rank += dictOfEmployees[employee["id"]]["count of given prefence"]-dictOfEmployees[employee["id"]]["count of shift scheduled"]

        employee["rank"] = rank
    return

def dictFromListOfEmployees(list_of_employees):
    result = dict()
    for employee in list_of_employees:
        result[employee["id"]] = employee
    return result

def updateShiftCount(dictOfEmployees):
    for key in dictOfEmployees:
        preferCount = 0
        availableCount = 0
        for prefenceOfDay in dictOfEmployees[key]["prefence"]:
            preferCount += len(prefenceOfDay["prefer"])
            availableCount += len(prefenceOfDay["available"])
        dictOfEmployees[key]["count of given prefence"] = preferCount + availableCount
        dictOfEmployees[key]["count of shift scheduled"] = 0
    return

def getEmployeeByHigestRank(listOfShifts):
    maxRank = float('-inf')
    maxRankEmployee = None
    for shift in listOfShifts:
        for employee in shift["employees_can_work"]:
            if employee["rank"] > maxRank:
                maxRank = employee["rank"]
                maxRankEmployee = employee
                maxShift = shift
    return maxShift, maxRankEmployee

def scheduleAllEmployeesToShift(shift, dictOfEmployees, listOfShifts):
    while(shift["employees_can_work"]):
        scheduleEmployeeToShift(shift["employees_can_work"][0], shift, dictOfEmployees, listOfShifts)
    return

def scheduleEmployeeToShift(employee, shiftToSchedule, dictOfEmployees, listOfShifts):
    dictOfEmployees[employee["id"]]["count of shift scheduled"] += 1
    for shift in listOfShifts:
        if shift["day"] == shiftToSchedule["day"]:
            shift["employees_can_work"].remove(employee)
    shiftToSchedule["employees"].append(employee["id"])
    return

def buildShifts():
    # fot each shift, add the employee that "available" or "prefer"
    listOfCompleteShift = []
    listOfShifts = get_list_of_shifts()
    list_of_employees = get_list_of_employees()
    dictOfEmployees = dictFromListOfEmployees(list_of_employees)

    #for each employee update how many shift he asked for, and add a place to count how many he got
    updateShiftCount(dictOfEmployees)

    for shift in listOfShifts:
        shift["employees_can_work"] = []
        for employee in list_of_employees:
            if isEmployeeCanWork(shift, employee):
                shift["employees_can_work"].append({"id": employee["id"], "rank": 0})

    # while there are shifts with "available" or "prefer" employee
    while listOfShifts:
        # remove the shifts that have the right amount of people

        isChanged = True
        while isChanged:
            isChanged = False
            for shift in listOfShifts:
                if shift["amount"] >= len(shift["employees_can_work"]):
                    scheduleAllEmployeesToShift(shift, dictOfEmployees, listOfShifts)
                    # pass shift to completed
                    del shift["employees_can_work"]
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

        if shiftToSched["amount"] >= len(shiftToSched["employees_can_work"]) or shiftToSched["amount"] == len(shiftToSched["employees"]):
            print("test")
            # pass shift to completed
            del shift["employees_can_work"]
            listOfCompleteShift.append(shift)
            listOfShifts.remove(shift)
    print("shift that did'nt completed:")
    print(listOfShifts)
    print("list of finish shifts:")
    print(listOfCompleteShift)
    return


buildShifts()
