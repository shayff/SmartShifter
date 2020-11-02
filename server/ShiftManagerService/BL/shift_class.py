import datetime
from server.ShiftManagerService import db
import json

''''
STILL NOT IN USE
'''
class shift:

    def __init__(self, company_id, shift_id):
        shift_from_db = db.get_shift(company_id,shift_id)
        if shift_from_db is not None:
            self.__dict__.update(shift_from_db)

    def __delete_field(self,data, field):
        '''
        Safe delete field from a dict
        '''
        check_for_del = data.get(field, None)
        if check_for_del:
            del data[field]
