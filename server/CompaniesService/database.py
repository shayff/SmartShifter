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

    def get_user(self,user_id):
        return self.users_collection.find_one({'_id': user_id})

    def get_user_by_email(self, user_email):
        return self.users_collection.find_one({'email': user_email})

    def get_company(self, company_id):
        return self.companies_collection.find_one({'_id': company_id})

    def inc_company_counter(self):
        doc = self.counters_collection.find_one_and_update({"_id": "companyid"}, {"$inc": {"value": 1}},
                                                         return_document=ReturnDocument.AFTER)
        return doc['value']

    def update_user_company(self, user_id, company_id):
        return self.users_collection.find_one_and_update({'_id': user_id}, {'$set': {'company': company_id}})

    def add_employee_to_company(self, company_id, employee_id):
        return self.companies_collection.find_one_and_update({'_id': company_id},
                                                 {'$addToSet': {"employees": employee_id}})

    def insert_company(self, new_company):
        return self.companies_collection.insert_one(new_company)

    def update_user_company(self, company_id, user_id):
        return self.users_collection.find_one_and_update({'_id': user_id}, { "$set": {'company': company_id}})

    def update_prefence_of_company(self, company_id, data):
        return self.companies_collection.find_one_and_update({'_id': company_id}, {'$set': {"prefence_from_manager": data}})

    def set_prefence_from_employee(self, company_id, user_id, preference):
        return self.companies_collection.find_one_and_update({'_id': company_id, 'employees.id': user_id},
                                                             {'$set': {'employees.$.preference': preference}})