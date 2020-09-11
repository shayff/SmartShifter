import numpy as np
from .Hungarian import Hungarian

#rank of availble/prefer
rank_of_prefer = 14
rank_of_available = 11
rank_of_not = 0


class buildshiftclass:
    def __init__(self,list_of_shifts,list_of_employees,dates):
        self.list_of_employees = list_of_employees
        self.list_of_shifts = list_of_shifts
        self.dates = dates

    def buildShift(self):
        scheduled_shifts = dict()
        for date in self.dates:
            # get the employess and shift that relevant for current date
            # Possible to improve by get the list all shift once and filter it each time
            list_of_shifts_by_date = self.get_list_of_shifts(date)
            list_of_employees_by_date = self.get_list_of_employees(date)


            # check if there is atleast 1 employe and 1 shift
            if list_of_shifts_by_date and list_of_employees_by_date:

                # run alogrithem for each job
                jobs_list = self.get_list_of_jobs(list_of_shifts_by_date)
                for job in jobs_list:
                    listOfShifts = self.filterShiftsByJob(list_of_shifts_by_date, job)
                    listOfEmployees = self.filterEmployeesByJob(list_of_employees_by_date, job)
                    if listOfShifts and listOfEmployees:
                        # build rank matrix
                        rank_matrix = self.build_rank_matrix(date, listOfShifts, listOfEmployees)

                        # Run the hungarian algorithm
                        hungarian = Hungarian(rank_matrix, is_profit_matrix=True)
                        hungarian.calculate()

                        for employee, shift in hungarian.get_results():
                            shift_id = listOfShifts[shift]["id"]
                            employee_id = listOfEmployees[employee]["id"]
                            print("worker:", employee_id, "scheduled for shift: ", shift_id)

                            # add the employe shifted to the scheduled_shifts dict
                            if shift_id in scheduled_shifts:
                                scheduled_shifts[shift_id].append(employee_id)
                            else:
                                scheduled_shifts[shift_id] = [employee_id]

                    # add the other shifts (still need to emlpoyees who didn't scheduled

                # add shifts that didn't was in algorithem
                for shift in list_of_shifts_by_date:
                    if shift["id"] not in scheduled_shifts:
                        scheduled_shifts[shift["id"]] = []
                #print("$")
                #hungarian_potential = get_hungarian_potential(hungarian)

                #print("$")
                if hungarian:
                    print("Build shift for date:", date, "With the total rank:", hungarian.get_total_potential())
                    print("-" * 60)
                #hungarian = None
        return scheduled_shifts

    # get list of shifts
    def get_list_of_shifts(self, date):
        list_of_shifts_by_date = [x for x in self.list_of_shifts if x['date'] == date]

        #get list where each shift duplicate by the shift['amount']
        result = []
        for shift in list_of_shifts_by_date:
            #Check how many employees already in shift
            num_of_employees_to_sched = shift['amount'] - len(shift["employees"])
            for i in range(num_of_employees_to_sched):
                result.append(shift)
        return result

    # get list of employees
    def get_list_of_employees(self, date):
        list_of_shifts_by_date = [x for x in self.list_of_shifts if x['date'] == date]
        employees_that_work_already = []
        for shift in self.list_of_shifts:
            if(date == shift["date"]):
                for employee in shift["employees"]:
                    employees_that_work_already.append(employee)

        #get list of employees that have prefence for the current date
        employees = [x for x in self.list_of_employees if self.is_prefence_for_given_date(x['preference'],date)]

        #remove employees that already work
        return [x for x in employees if x["id"] not in employees_that_work_already]

    def is_prefence_for_given_date(self, preference, date):
        for x in preference:
            if(x['date'] == date):
                #check if there is atleast one prefence or aviable
                if(x['prefer'] or x['available']):
                    return True
        return False

    def build_rank_matrix(self, date,listOfShifts, listOfEmployees):
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
                rank_to_add = rank_of_not
                if(prefence_of_employee_to_shift != None):

                    #Check if employee has prefence for all prefence needed for the shift
                    big  = prefence_of_employee_to_shift['prefer'] + prefence_of_employee_to_shift['available']
                    small = listOfShifts[x]["day_part"]
                    result = all(elem in big for elem in small)

                    if result:

                        #for each part of the shift we check employee prefence and set the rank
                        for prefer in listOfShifts[x]["day_part"]:
                            if(prefer in prefence_of_employee_to_shift['prefer']):
                                rank_to_add += rank_of_prefer
                            elif(prefer in prefence_of_employee_to_shift['available']):
                                rank_to_add += rank_of_available
                            else:
                                rank_to_add += rank_of_not

               #add the current rank for the rank matrix
                rank_matrix[y, x] += rank_to_add
        return rank_matrix

    def get_list_of_jobs(self, listOfShifts):
        jobs = set()
        for shift in listOfShifts:
            jobs.add(shift["job_type"])
        return list(jobs)

    def filterShiftsByJob(self, listOfShifts, job):
        return [x for x in listOfShifts if x["job_type"] == job]

    def filterEmployeesByJob(self, listOfEmployees, job):
        return [x for x in listOfEmployees if job in x["job_type"]]

    def get_hungarian_potential(self, hungarian):
        print(hungarian)
        if hungarian:
            return hungarian.get_total_potential()
        else:
            return -1