import datetime
from server.ShiftManagerService import db
import json

class ShiftsManager:
    def __init__(self, company_id):
        self.company_id = company_id

    def delete_shifts(self, list_of_shifts_id):
        # for each shift if exist delete it
        for shift_id in list_of_shifts_id:
            if self.__is_shift_exist(shift_id):
                self.__delete_shift(shift_id)

    def __is_shift_exist(self, shift_id):
        doc = db.get_shift_employee(self.company_id, shift_id)
        return "shifts" in doc

    def __delete_shift(self, shift_id):
        # delete relevant swaps
        db.delete_shift_swap_by_shift_id(self.company_id, shift_id)

        # delete the shift
        db.delete_shift(self.company_id, shift_id)