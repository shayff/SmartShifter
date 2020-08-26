from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from pymongo import MongoClient
from server.config import MongoConfig
from .schemas.updateMessage import validate_updatemessage
from .. import db

def doUpdateMessage(data):
    data = validate_updatemessage(data)
    current_user = get_jwt_identity()
    if data['ok']:
        data = data['data']
        message = db.users_collection.find_one_and_update({'_id': current_user['_id'], 'messages.id': data['id']},
                                                       {'$set': {'messages.$.status': data['status']}})

        if (message == None):
            return jsonify({'ok': False, 'msg': 'invalid message not exist'}), 401
        else:
            return jsonify({'ok': True, 'msg': ' Update message successfully'}), 200
    else:
        return jsonify({'ok': False, 'msg': 'Bad request parameters: {}'.format(data['msg'])}), 400
