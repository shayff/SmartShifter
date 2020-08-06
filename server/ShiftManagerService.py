#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from ShiftManagerService.BuildShift import doBuildShift
from ShiftManagerService.AskShiftSwap import doAskShiftSwap
from ShiftManagerService.CanShiftSwap import doCanShiftSwap
from ShiftManagerService.ConfirmShiftSwap import doConfirmShiftSwap
from server.ShiftManagerService.GetShifts import doGetShifts
from server.ShiftManagerService.SetShiftsSchedule import doSetShiftsSchedule
from ShiftManagerService.GetShiftsSwaps import doGetShiftsSwaps
from flask_cors import CORS


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
cors = CORS(app)
app.config['SECRET_KEY'] = 'JustDemonstrating'
app.config['JWT_SECRET_KEY'] = '1asdasd#$$!1ddX'
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
        'msg': 'Missing Authorization Header'
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route('/buildshift', methods=['POST'])
@jwt_required
def buildShift():
    return doBuildShift(request.get_json())

@app.route('/SetShiftsSchedule', methods= ['POST'])
@jwt_required
def SetShiftsSchedule():
    return doSetShiftsSchedule(request.get_json())

@app.route('/AskShiftSwap', methods=['POST'])
@jwt_required
def AskShiftSwap():
    return doAskShiftSwap(request.get_json())

@app.route('/CanShiftSwap', methods=['POST'])
@jwt_required
def CanShiftSwap():
    return doCanShiftSwap(request.get_json())


@app.route('/GetShifts', methods= ['POST'])
@jwt_required
def GetShifts():
    return doGetShifts(request.get_json())


@app.route('/ConfirmShiftSwap', methods=['POST'])
@jwt_required
def ConfirmShiftSwap():
    return doConfirmShiftSwap(request.get_json())

@app.route('/GetShiftsSwaps', methods=['POST'])
@jwt_required
def GetShiftsSwaps():
    return doGetShiftsSwaps(request.get_json())


#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5002)