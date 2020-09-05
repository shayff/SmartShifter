from server.config import MongoConfig
from pymongo import MongoClient

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
