from . import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from .schemas.sendMessage import validate_sendMessage
from datetime import datetime

def doSendMessage(user_input):
    '''
    This method send message to user by given employees id, shifts or dates.
    '''
    data = validate_sendMessage(user_input)
    if data["ok"]:
        data = data['data']
        logged_in_user = get_jwt_identity()

        # we get the id's of employees we want to send message by employee, shift or date
        send_to_data = data["to"]
        set_ids = set()

        if "company" in logged_in_user:
            company_id = logged_in_user["company"]
            shifts = []
            dates = []

            if "employees" in send_to_data:
                set_ids.update(send_to_data["employees"])
            shifts = db.companies_collection.find_one({'_id': company_id},
                                                       {"shifts.id": 1, "shifts.employees": 1, "shifts.date": 1})["shifts"]
            if "shifts" in send_to_data:
                send_shifts = send_to_data["shifts"]
            if "dates" in send_to_data:
                send_dates = send_to_data["dates"]
            for shift in shifts:
                if shift["id"] in send_shifts or shift["date"] in send_dates:
                    set_ids.update(shift["employees"])

        message = prepare_message(set_ids,logged_in_user["_id"],data["title"],data["message"])

        # insert message to message collection
        db.messages_collection.insert_one(message)

        # insert the message to each employee
        for user_id in set_ids:
            db.users_collection.update({'_id': user_id}, {'$push':
                                                           {'messages':
                                                                {'$each': [
                                                                    {'id': message['_id'], 'status': 'unread'}],'$position': 0}}})

        print(message)
        return jsonify({'ok': True, 'msg': 'The message sent successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

def prepare_message(send_to,send_from, title, message):

    # update counter message id
    count_id = db.inc_message_counter()

    message = {
        "_id": count_id,
        "to": list(send_to),
        "from": send_from,
        "message": message,
        "time_created": datetime.now().ctime()
    }

    return message