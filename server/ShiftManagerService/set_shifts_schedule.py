from . import db
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from server.MembersService.send_message import send_message

def set_shifts_schedule(data):
        # check if user has company
        logged_in_user = get_jwt_identity()
        user_from_db = db.get_user(logged_in_user["_id"])
        employees = set()

        if "company" in user_from_db:
            company_id = user_from_db["company"]
            shifts = data["data"]
            doc = set_employees_to_shifts(company_id, employees, shifts)

            # send message to employees
            send_message_to_employees(employees)
            db.delete_prefence_of_company(company_id)

            return jsonify({"ok": True, "msg": "Update shift successfully"}), 200
        else:
            return jsonify({"ok": False, "msg": "User has no company"}), 401

def set_employees_to_shifts(company_id, employees, shifts):
    for key, value in shifts.items():
        doc = db.companies_collection.update_one({"_id": company_id, "shifts.id": int(key)},
                                                  {"$set": {"shifts.$.employees": value, "shifts.$.status": "scheduled"}})
        employees.update(value)
    return doc

def send_message_to_employees(employees):
    message = {"to": [list(employees)],
               "title": "You just scheduled to new shifts",
               "message": "Take a look at the shift page, you got new shifts"}
    send_message(message)