from server.ShiftManagerService import db

class ShiftData:
    def __init__(self, company_id):
        '''
        To save server request we bring data of all employees
        '''
        self.employees_full_data = {}
        company_from_db = db.get_company(company_id)
        employees = company_from_db['employees']
        for employee in employees:
            employee_from_db =  db.get_user_name(employee["id"])
            self.employees_full_data[employee["id"]] = employee_from_db

    def get_employee_data(self, id):
        '''
        This method return the full name of the employees
        '''
        if id in self.employees_full_data:
            return self.employees_full_data[id]
        else:
            #if in some case the employee needed not in the employee fulldata
            return db.get_user_name(id)