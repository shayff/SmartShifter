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
        doc = self.counters_collection.find_one_and_update({'_id': 'messageid'}, {'$inc': {'value': 1}},
                                                         return_document=ReturnDocument.AFTER)
        return doc['value']
