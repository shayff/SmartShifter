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

    def get_user_password(self, user_id):
        return self.users_collection.find_one({"_id": user_id}, {"password": 1})

    def update_user_password(self, user_id, new_password):
        return self.users_collection.find_one_and_update({"_id": user_id}, {"$set" : {'password': new_password}})

    def get_message(self, msg_id):
        return self.messages_collection.find_one({"_id": msg_id})

    def get_messages_from_user(self, user_id):
        return self.messages_collection.find({'from': user_id})

    def get_user_details_of_message(self, user_id, message_id):
        return self.users_collection.find_one({"_id": user_id},{"messages": {"$elemMatch": {"id": message_id}},
                                                                "first_name": 1, "last_name": 1})

    def get_user_by_email(self, user_email):
        return self.users_collection.find_one({'email': user_email})

    def get_user_by_id_number(self, id_number):
        return self.users_collection.find_one({"id_number": id_number})

    def insert_user(self, new_user):
        return self.users_collection.insert_one(new_user)

    def get_shift_with_dates(self, company_id):
        return self.companies_collection.find_one({"_id": company_id},
                                              {"shifts.id": 1, "shifts.employees": 1, "shifts.date": 1})["shifts"]

    def update_message_status(self, user_id, message_id, status):
        return self.users_collection.find_one_and_update({"_id": user_id, 'messages.id': message_id},
                                                         {'$set': {'messages.$.status': status}})

    def update_user(self, user_id, data):
        return self.users_collection.find_one_and_update({"_id": user_id}, {'$set': data})