#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from ShiftManagerService.BuildShift import doBuildShift

class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'JustDemonstrating'
app.config['JWT_SECRET_KEY'] = "1asdasd#$$!1ddX"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)
app.json_encoder = JSONEncoder

blacklist = set()

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'ok': False,
        'msgs': 'Missing Authorization Header'
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route("/buildshift", methods=['GET'])
@jwt_required
def buildShift():
    return doBuildShift()

#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5002)