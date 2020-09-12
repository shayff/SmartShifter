def sort_shifts_by_start_time(shifts):
    for shifts_by_day in shifts:
        shifts[shifts_by_day].sort(key=lambda x: x["start_time"], reverse=False)
    return


def add_full_data_of_employees_to_shifts(employees_id, shift, shift_data):
    '''
    For each employee id we get from DB the name and appened to the employees array of the shift
    '''
    employee_full_details_array = []
    for id_employee in employees_id:
        employee_full_details_array.append(shift_data.get_employee_data(id_employee))
    shift['employees'] = employee_full_details_array

def add_is_shift_full_field(shift):
    '''
    This method add check if shift is full and add this field
    '''
    if shift['amount'] == len(shift['employees']):
        shift['is_shift_full'] = 'full'
    else:
        shift['is_shift_full'] = 'not_full'