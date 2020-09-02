def sort_shifts_by_start_time(shifts):
    for shifts_by_day in shifts:
        shifts[shifts_by_day].sort(key=lambda x: x["start time"], reverse=False)
    return


def add_full_data_of_employees_to_shifts(employees_id, shift, shift_data):
    '''
    For each employee id we get from DB the name and appened to the employees array of the shift
    '''
    employee_full_details_array = []
    for id_employee in employees_id:
        employee_full_details_array.append(shift_data.getEmployee(id_employee))
    shift['employees'] = employee_full_details_array