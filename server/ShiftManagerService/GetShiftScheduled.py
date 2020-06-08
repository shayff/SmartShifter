from pymongo import MongoClient
from server.config import MongoConfig
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request, jsonify
from datetime import time, datetime, timedelta

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


def DoGetShiftScheduled(data):
    # data = getshiftscheduled(data)
    # if data['ok']:
    #     data = data['data']
        current_user = get_jwt_identity()
        user = users_collection.find_one({'_id': current_user['_id']})
        shiftScheduled = dict()

        # check if user has company
        if 'company' in user:
            company_id = user['company']
            print(company_id)
            company = companies_collection.find_one({'_id': company_id})
            list_of_shifts = company['shifts']

            for shift in list_of_shifts:
               print(shift)
               for id_employee in shift['employees']:
                   name_employee = users_collection.find_one({'_id': id_employee})
                   shift['employees']
               if shift['date'] in shiftScheduled:
                   shiftScheduled[shift['date']].append(shift)
               else:
                    shiftScheduled[shift['date']] = [shift]




