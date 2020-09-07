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
        return self.users_collection.find_one({'email': user_email['email']})

    def inc_company_counter(self):
        doc = db.counters_collection.find_one_and_update({"_id": "companyid"}, {"$inc": {"value": 1}},
                                                         return_document=ReturnDocument.AFTER)
        return doc['value']

    def update_user_company(self, user_id, company_id):
        return self.users_collection.find_one_and_update({'_id': employee_to_add["id"]}, {'$set': {'company': company_id}})