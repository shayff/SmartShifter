from server.config import MongoConfig
from pymongo import MongoClient, ReturnDocument

class Mongo_db:
    '''
    This class wrap the work with the database.
    This should make it eaiser to change Database platform in future.
    '''
    def __init__(self):
        cluster = MongoClient(MongoConfig['ConnectionString'])
        db = cluster[MongoConfig['ClusterName']]
        self.users_collection = db['users']
        self.companies_collection = db["companies"]
        self.counters_collection = db["counters"]
        self.messages_collection = db["messages"]



    def get_user(self, user_id):
        return self.users_collection.find_one({"_id": user_id})

    def get_user_name(self, user_id):
        return self.users_collection.find_one({"_id": user_id}, {"first_name", "last_name"})

    def get_company(self, company_id):
        return self.companies_collection.find_one({"_id": company_id})

    def get_company_shift(self, company_id):
        return self.companies_collection.find_one({"_id": company_id},{'shifts':1})

    def update_shift(self, company_id, shift_id, shift_data):
        return self.companies_collection.update_one({"_id": company_id, 'shifts.id': shift_id},
                                                    {'$set': {'shifts.$': shift_data}})

    def inc_shifts_counter(self, company_id):
        doc = self.companies_collection.find_one_and_update({"_id": company_id}, {'$inc': {'shifts_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)
        return doc['shifts_counter']

    def inc_shifts_swaps_counter(self, company_id):
        return self.companies_collection.find_one_and_update({"_id": company_id}, {'$inc': {'shifts_swaps_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)

    def insert_shift(self, company_id, new_shift):
        return self.companies_collection.find_one_and_update({"_id": company_id}, {'$push': {'shifts': new_shift}})

    def delete_prefence_of_company(self, company_id):
        return self.companies_collection.find_one_and_update({"_id": company_id},{'$set': {"prefence_from_manager" : []}})

    def get_shift_swap_by_shift_id(self, company_id, user_id, shift_id):
        return self.companies_collection.find_one({"_id": company_id},
                                                  {"shifts_swaps":
                                                       {"$elemMatch":
                                                            {"id_employee_ask": user_id, "shift_id": shift_id}}})

    def get_shift_swap(self, company_id, swap_id):
        return self.companies_collection.find_one({"_id": company_id , 'shifts_swaps.id': swap_id},
                                                  {'shifts_swaps.$': swap_id})

    def get_employees_of_shift(self, company_id, shift_id):
        doc = self.companies_collection.find_one({"_id": company_id, 'shifts.id': shift_id},
                                                  {'shifts': {'$elemMatch': {"id":shift_id}}, "shifts.employees":1})
        return doc['shifts'][0]['employees']

    def update_employees_in_shift(self, company_id, shift_id, employees):
        return self.companies_collection.update({"_id": company_id, 'shifts.id': shift_id},
                                                        {'$set': {'shifts.$.employees': employees}})

    def remove_employees_can_from_swap(self, company_id, swap_id):
        return self.companies_collection.find_one_and_update({"_id": company_id, 'shifts_swaps.id': swap_id},
                                                                {'$unset': {'shifts_swaps.$.id_employee_can': ""}})

    def update_status_of_swap(self, company_id, swap_id, new_status):
        return self.companies_collection.update({"_id": company_id, 'shifts_swaps.id': swap_id},
                                                {'$set': {'shifts_swaps.$.status': new_status}})

    def get_shift(self, company_id, shift_id):
        doc = self.companies_collection.find_one({"_id": company_id}, {"shifts": {"$elemMatch": {"id": shift_id}}})
        return doc["shifts"][0]

    def update_employee_and_status_in_shift(self, company_id, shift_id, employees, status):
        return self.companies_collection.update_one({"_id": company_id, "shifts.id": shift_id},
                                                {"$set": {"shifts.$.employees": employees, "shifts.$.status": status}})

    def delete_shift_swap_by_shift_id(self, company_id, shift_id):
        return self.companies_collection.update_one({"_id": company_id},
                                                    {"$pull": {"shifts_swaps": {"shift_id": shift_id}}})

    def delete_shift_swap(self, company_id, swap_id):
        return self.companies_collection.update_one({"_id": company_id},{"$pull": {"shifts_swaps": {"id": swap_id}}})


    def delete_shift(self, company_id, shift_id):
        return self.companies_collection.update_one({"_id": company_id}, {"$pull": {"shifts": {"id": shift_id}}})

    def get_shift_employee(self, company_id, shift_id):
        return self.companies_collection.find_one({"_id": company_id},
                                        {"shifts": {"$elemMatch": {"id": shift_id}}, "shifts.employees": 1})

    def insert_shift_swap(self, company_id, shift_swap):
        return self.companies_collection.find_one_and_update({"_id": company_id}, {'$push': {'shifts_swaps': shift_swap}})
