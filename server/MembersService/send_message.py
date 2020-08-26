from datetime import datetime
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import collection, MongoClient, ReturnDocument
from server.config import MongoConfig
from .schemas.sendMessage import validate_sendMessage

# connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']
messages_collection = db['messages']
counter = db['counters']
companies_collection = db["companies"]

def doSendMessage(user_input):
    '''
    This method send message to user by given employees id, shifts or dates.
    '''
    data = validate_sendMessage(user_input)
    if data["ok"]:
        data = data['data']
        current_user = get_jwt_identity()

        if "company" in current_user:
            company_id = current_user["company"]

            #we get the id's of employees we want to send message by employee, shift or date
            set_ids = get_employees_id_to_send(company_id, data["to"])

            message = prepare_message(set_ids,current_user["_id"],data["title"],data["message"])

            # insert message to message collection
            messages_collection.insert_one(message)

            # insert the message to each employee
            for user_id in set_ids:
                users_collection.update({'_id': user_id}, {'$push':
                                                               {'messages':
                                                                    {'$each': [
                                                                        {'id': message['_id'], 'status': 'unread'}],'$position': 0}}})

            print(message)
            return jsonify({'ok': True, 'msg': 'The message sent successfully'}), 200
        else:
            return jsonify({'ok': True, 'msg': 'Company not found'}), 401
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400


def get_employees_id_to_send(company_id, send_to_data):

    set_ids = set()
    shifts = []
    dates = []

    if "employees" in send_to_data:
        set_ids.update(send_to_data["employees"])
    shifts = companies_collection.find_one({'_id': company_id},
                                           {"shifts.id": 1, "shifts.employees": 1, "shifts.date": 1})["shifts"]
    if "shifts" in send_to_data:
        send_shifts = send_to_data["shifts"]
    if "dates" in send_to_data:
        send_dates = send_to_data["dates"]
    for shift in shifts:
        if shift["id"] in send_shifts or shift["date"] in send_dates:
            set_ids.update(shift["employees"])

    return set_ids

def prepare_message(send_to,send_from, title, message):

    # update counter message id
    doc = counter.find_one_and_update({'_id': 'messageid'}, {'$inc': {'value': 1}},
                                      return_document=ReturnDocument.AFTER)
    count_id = doc['value']


    message = {
        "_id": count_id,
        "to": list(send_to),
        "from": send_from,
        "message": message,
        "time_created": datetime.now().ctime()
    }

    return message