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

# get list of employees
def get_list_of_employees():
    company =companies_collection.find_one({'_id': company_id})
    list_of_employees = company['employees']
    return list_of_employees

# fot each shift, add the employee that "available" or "prefer"

# remove the shifts that have the right amount of people

#while there are shifts with "available" or "prefer" employee

    # rank each employee match to a shift

    # scehdule the employee with the higest rank

    # remove the shift