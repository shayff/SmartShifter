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
        user_from_db = db.get_user(logged_in_user["_id"])
        # we get the id's of employees we want to send message by employee, shift or date
        send_to_data = data["to"]
        set_ids = set()

        if "company" in user_from_db:
            company_id = user_from_db["company"]
            company = db.get_company(company_id)
            send_shifts = []
            send_dates = []

            shifts = db.companies_collection.find_one({'_id': company_id},
                                                      {"shifts.id": 1, "shifts.employees": 1, "shifts.date": 1})["shifts"]

            if "job_type" in send_to_data:
                #make a list of employees where any of employee job in any of job we want to send message
                ids_by_jobs = [emp["id"] for emp in company["employees"] if(any(job in emp["job_type"] for job in send_to_data["job_type"]))]
                set_ids.update(ids_by_jobs)

            if "employees" in send_to_data:
                set_ids.update(send_to_data["employees"])

            if "shifts" in send_to_data:
                send_shifts = send_to_data["shifts"]

            if "dates" in send_to_data:
                send_dates = send_to_data["dates"]

            for shift in shifts:
                if shift["id"] in send_shifts or shift["date"] in send_dates:
                    set_ids.update(shift["employees"])

            message = prepare_message(set_ids,logged_in_user["_id"],data["title"],data["message"])

            # insert message to message collection
            db.add_message(message)

            # insert the message to each employee
            for user_id in set_ids:
                db.update_message_to_user(user_id, message)

            print(message)
            return jsonify({'ok': True, 'msg': 'The message sent successfully'}), 200
        else:
            return jsonify({'ok': False, 'msg': "User has no company"}), 400
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400

def prepare_message(send_to,send_from, title, message):

    # update counter message id
    count_id = db.inc_message_counter()

    message = {
        "_id": count_id,
        "to": list(send_to),
        "title": title,
        "from": send_from,
        "message": message,
        "time_created": datetime.now().ctime()
    }

    return message