import datetime
from . import db
import json

class user:

    def __init__(self, user_id):
        user_from_db = db.get_user(user_id)
        if user_from_db is not None:
            self.__dict__.update(user_from_db)

            self.__update_company_field()

    def get_profile(self):
        profile = self.__dict__
        self.__delete_field(profile,"password")
        self.__delete_field(profile,"messages")
        return profile



    def get_messages(self):
        list_messages = []

        # for each msg id we get the message and add full details
        for msg_id in self.messages:
            msg = db.get_message(msg_id["id"])
            self.__add_full_data_to_message(msg, msg_id)
            list_messages.append(msg)

        #sort the messages
        list_messages = sorted(list_messages, key=lambda message: datetime.datetime.strptime(message["time_created"],
                                                                                             "%a %b %d %H:%M:%S %Y"),
                                                                                                            reverse=True)
        return list_messages

    def __delete_field(self,data, field):
        '''
        Safe delete field from a dict
        '''
        check_for_del = data.get(field, None)
        if check_for_del:
            del data[field]

    def __update_company_field(self):
        '''
        This method take care of company fields in user profile
        '''
        self.is_has_company = hasattr(self, 'company')
        if hasattr(self, 'company'):
            company_id = self.company
            company = db.get_company(company_id)
            self.company_name = company["company_name"]

    def __add_full_data_to_message(self, msg, msg_id):
        msg["status"] = msg_id["status"]
        msg["sender_name"] = db.get_user_name(msg["from"])