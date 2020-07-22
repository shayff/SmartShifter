from pymongo import MongoClient
from config import MongoConfig
from flask import jsonify
from flask_jwt_extended import get_jwt_identity


#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']

#data= {"start_date": "2020-04-12", "end_date": "2020-04-14"}
def doGetShiftScheduled(data):

    current_user = get_jwt_identity()
    user = users_collection.find_one({'_id': current_user['_id']})
    shiftScheduled = dict()

    # check if user has company
    if 'company' in user:
        company_id = user['company']
        company = companies_collection.find_one({'_id': company_id})
        list_of_shifts = company['shifts']

        for shift in list_of_shifts:
            dic_employees = {}
            if shift['date']>=data['start_date'] and shift['date']<=data['end_date']:

                #Add a employee list on each shift
                for id_employee in shift['employees']:
                    employee_db = users_collection.find_one({'_id': id_employee},{'first name','last name'})
                    x = {id_employee : employee_db}
                    dic_employees.update(x)
                shift['employees'] = dic_employees

                #del - del object["last name"]
                del shift["difficulty"]

                if shift['date'] in shiftScheduled:
                    shiftScheduled[shift['date']].append(shift)
                else:
                    shiftScheduled[shift['date']] = [shift]

        print(shiftScheduled)
        return jsonify({'ok': True, 'msg': 'Created shift Scheduled successfully'}), 200
    else:
        return jsonify({'ok': True, 'msg': 'User don\'t have company'}), 401




