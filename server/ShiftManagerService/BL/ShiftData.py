from pymongo import MongoClient

MongoConfig ={
    "ConnectionString": "mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority",
    "ClusterName": "shifter_db"
}
#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


class ShiftData:
    def __init__(self, company_id):
        '''
        To save server request we bring data of all employees
        '''
        self.employees_full_data = {}
        company = companies_collection.find_one({'_id': company_id})
        employees = company['employees']
        for employee in employees:
            employee_from_db = users_collection.find_one({'_id': employee['id']}, {'first name', 'last name'})
            employee_from_db["first_name"] = employee_from_db.pop("first name")
            employee_from_db["last_name"] = employee_from_db.pop("last name")

            self.employees_full_data[employee['id']] = employee_from_db

    def get_employee_data(self, id):
        '''
        This method return the full name of the employees
        '''
        if id in self.employees_full_data:
            return self.employees_full_data[id]
        else:
            #if in some case the employee needed not in the employee fulldata
            emp = users_collection.find_one({'_id': id}, {'first name', 'last name'})
            emp["first_name"] = emp.pop("first name")
            emp["last_name"] = emp.pop("last name")
            return emp