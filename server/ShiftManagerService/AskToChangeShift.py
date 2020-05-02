from pymongo import MongoClient
from server.config import MongoConfig
from config import MongoConfig
from flask_jwt_extended import get_jwt_identity
from flask import Flask, request, jsonify
from datetime import time, datetime, timedelta
from .schemas.asktochangeshift import validate_askToChangeShift

#connect to database
cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db['companies']
users_collection = db['users']


def doAskToChangeShift(userInput):
    data = validate_askToChangeShift(userInput)
    if data['ok']:
        data = data['data']
        current_user = get_jwt_identity()
        result = users_collection.find_one({'_id': current_user['_id']})

        if 'company' not in result:
            return jsonify({'ok': False, 'msg': 'User don\'t have company'}), 401
        else:
            companyId = result['company']
            company = companies_collection.find_one({'_id': companyId})
            shift = next((x for x in company['shifts'] if x['id'] == data['shift']), None)

        return jsonify({'ok': True, 'msg': 'build shift', 'data': 'test'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400


