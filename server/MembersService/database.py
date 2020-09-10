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

    def inc_message_counter(self):
        doc = self.counters_collection.find_one_and_update({"_id": 'messageid'}, {'$inc': {'value': 1}},
                                                         return_document=ReturnDocument.AFTER)
        return doc['value']

    def inc_users_counter(self):
        doc = self.counters_collection.find_one_and_update({"_id": 'userid'}, {'$inc': {'value': 1}},
                                                         return_document=ReturnDocument.AFTER)
        return doc['value']

    def get_company(self, company_id):
        return self.companies_collection.find_one({"_id": company_id})

    def add_message(self, message):
        return self.messages_collection.insert_one(message)

    def update_message_to_user(self, user_id, message):
        return self.users_collection.update({"_id": user_id}, {'$push':
            {'messages':
                {'$each': [
                    {"id": message["_id"], 'status': 'unread'}], '$position': 0}}})

    def get_user(self, user_id):
        return self.users_collection.find_one({"_id": user_id})