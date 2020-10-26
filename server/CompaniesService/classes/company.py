import datetime
from server.CompaniesService import db
import json

class company:

    def __init__(self, company_id):
        company_from_db = db.get_company(company_id)
        if company_from_db is not None:
            self.__dict__.update(company_from_db)

    def get_profile(self):
        company_profile = self.__dict__

        # delete unnecessary data
        self.__delete_field(company_profile,"employees")
        self.__delete_field(company_profile,"shifts")
        self.__delete_field(company_profile,"shifts_swaps")
        return company_profile

    def get_employees_full_data(self):
        employees = self.employees
        list_of_employees_full_data = []

        # iterate through each employee and get full details
        for employee in employees:
            # get full data of employee
            employee_from_db = self.__update_employee_full_data(employee)

            # add to list of all employees
            list_of_employees_full_data.append(employee_from_db)

        return list_of_employees_full_data

    def __update_employee_full_data(self, employee):
        employee_from_db = db.get_user(employee["id"])
        employee_from_db["job_type"] = employee["job_type"]
        employee_from_db['rank'] = employee['rank']

        if "password" in employee_from_db:
            del employee_from_db['password']
        if "company" in employee_from_db:
            del employee_from_db["company"]

        return employee_from_db

    def __delete_field(self,data, field):
        '''
        Safe delete field from a dict
        '''
        check_for_del = data.get(field, None)
        if check_for_del:
            del data[field]
