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
        return self.users_collection.find_one({'_id': user_id})

    def get_company(self, company_id):
        return self.companies_collection.find_one({'_id': company_id})

    def update_shift(self, company_id, shift_id, shift_data):
        return self.companies_collection.update_one({'_id': company_id, 'shifts.id': shift_id}, {'$set':
                                                                                                   {'shifts.$': shift_data}})

    def inc_shifts_counter(self):
        doc = self.companies_collection.find_one_and_update({'_id': company_id}, {'$inc': {'shifts_counter': 1}},
                                                           return_document=ReturnDocument.AFTER)
        return doc['shifts_counter']

    def insert_shift(self, company_id, new_shift):
        self.companies_collection.find_one_and_update({'_id': company_id}, {'$push': {'shifts': new_shift}})
