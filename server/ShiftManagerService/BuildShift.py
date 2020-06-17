from pymongo import MongoClient
import numpy as np
from .BL.Hungarian import Hungarian
from flask_jwt_extended import get_jwt_identity
from flask import jsonify


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
rank_of_prefer = 13
rank_of_available = 11
rank_of_not = 0


def doBuildShift(data):
    dates=data['dates']
    current_user = get_jwt_identity()
    result = users_collection.find_one({'_id': current_user['_id']})
    if 'company' not in result:
        return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
    else:
        company_id = result['company']
        scheduled_shifts = build_shifts(dates, company_id)

    return jsonify({'ok': True, 'msg': 'build shift', 'data': scheduled_shifts}), 200

def build_rank_matrix(companyId, date,listOfShifts, listOfEmployees):
    # for each shift, add the employee that "available" or "prefer"

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
            date = listOfShifts[x]['date']
            prefence_of_employee_to_shift = next((z for z in listOfEmployees[y]['preference'] if z['date'] == date), None)

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

# get list of shifts
def get_list_of_shifts(companyId,date):
    company = companies_collection.find_one({'_id': companyId})
    list_of_shifts = company['shifts']
    list_of_shifts = [x for x in list_of_shifts if x['date'] == date]

    #get list where each shift duplicate by the shift['amount']
    result = []
    for shift in list_of_shifts:
        for i in range(shift['amount']):
            result.append(shift)
    return result

# get list of employees
def get_list_of_employees(companyId,date):
    company =companies_collection.find_one({'_id': companyId})
    list_of_employees = company['employees']
    return [x for x in list_of_employees if is_prefence_for_given_date(x['preference'],date)]

def is_prefence_for_given_date(preference,date):
    for x in preference:
        if(x['date'] == date):
            #check if there is atleast one prefence or aviable
            if(x['prefer'] or x['available']):
                return True
    return False

def build_shifts(date_array,company_id):
    scheduled_shifts = dict()

    for date in date_array:
        # get the employess and shift that relevant for current date
        # Possible to improve by get the list all shift once and filter it each time
        listOfShifts = get_list_of_shifts(company_id, date)
        listOfEmployees = get_list_of_employees(company_id, date)

        #check if there is atleast 1 employe and 1 shift
        if not listOfShifts or not listOfEmployees:
            print("No shifts or employees")
            return None
        else:
            # build rank matrix
            rank_matrix = build_rank_matrix(company_id,date,listOfShifts,listOfEmployees)

            # Run the hungarian algorithm
            hungarian = Hungarian(rank_matrix, is_profit_matrix = True)
            hungarian.calculate()

            for employee,shift in hungarian.get_results():
                shift_id = listOfShifts[shift]['id']
                employee_id = listOfEmployees[employee]['id']
                print("worker:", employee_id, "scheduled for shift: ", shift_id)

                # add the employe shifted to the scheduled_shifts dict
                if shift_id in scheduled_shifts:
                    scheduled_shifts[shift_id].append(employee_id)
                else:
                    scheduled_shifts[shift_id] = [employee_id]

            print("Build shift for date:",date, "With the total rank:",hungarian.get_total_potential())
            print("-" * 60)

        return scheduled_shifts
