from server.config import FlaskConfig
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
from flask_cors import CORS
import datetime, json
from bson.objectid import ObjectId
from server.ShiftManagerService.BuildShift import doBuildShift
from server.ShiftManagerService.create_shift_swap import doAskShiftSwap
from server.ShiftManagerService.can_swap_shift import can_swap_shift
from server.ShiftManagerService.confirm_swap import doConfirmShiftSwap
from server.ShiftManagerService.get_shifts import doGetShifts
from server.ShiftManagerService.SetShiftsSchedule import doSetShiftsSchedule
from server.ShiftManagerService.get_shifts_swaps import doGetShiftsSwaps
from server.ShiftManagerService.delete_shift_swap import delete_shift_swap

from server.ShiftManagerService.update_shift import update_shift
from server.ShiftManagerService.delete_shifts import delete_shifts
from server.ShiftManagerService.create_shift import create_shift


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
app.config['SECRET_KEY'] = FlaskConfig["SECRET_KEY"]
app.config['JWT_SECRET_KEY'] = FlaskConfig["JWT_SECRET_KEY"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)
app.json_encoder = JSONEncoder

blacklist = set()

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        "ok": False,
        "msg": 'Missing Authorization Header'
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route('/api/v1/shifts/build', methods=["POST"])
@app.route('/buildshift', methods=["POST"])
@jwt_required
def buildShift():
    return doBuildShift(request.get_json())

@app.route('/api/v1/shifts/set', methods=["POST"])
@app.route('/SetShiftsSchedule', methods= ["POST"])
@jwt_required
def SetShiftsSchedule():
    return doSetShiftsSchedule(request.get_json())

@app.route('/api/v1/shifts_swaps', methods=["POST"])
@app.route('/AskShiftSwap', methods=["POST"])
@jwt_required
def AskShiftSwap():
    return doAskShiftSwap(request.get_json())

@app.route('/api/v1/shifts_swaps/can_swap', methods= ["POST"])
@app.route('/CanShiftSwap', methods=["POST"])
@jwt_required
def CanShiftSwap():
    return can_swap_shift(request.get_json())

@app.route('/api/v1/shifts_swaps/confirm', methods= ["POST"])
@app.route('/ConfirmShiftSwap', methods=["POST"])
@jwt_required
def ConfirmShiftSwap():
    return doConfirmShiftSwap(request.get_json())

@app.route('/api/v1/shifts_swaps', methods= ['GET'])
@app.route('/GetShiftsSwaps', methods=["POST"])
@jwt_required
def GetShiftsSwaps():
    statuses = request.args.getlist("status")
    return doGetShiftsSwaps(statuses)

@app.route("/api/v1/shift", methods=['PUT'])
@jwt_required
def UpdateShift():
    return update_shift(request.get_json())

@app.route("/api/v1/shift", methods=["POST"])
@jwt_required
def AddShifts():
    return create_shift(request.get_json())

@app.route("/api/v1/shift", methods=['DELETE'])
@jwt_required
def DeleteShift():
    #return doDeleteShift(shift_id)
    return delete_shifts(request.get_json())

@app.route("/api/v1/shift_swap/<swap_id>", methods=['DELETE'])
@jwt_required
def DeleteShiftSwap(swap_id):
    return delete_shift_swap(swap_id)

#we need here parameters
@app.route('/GetShifts', methods= ["POST"])
@jwt_required
def GetShifts2():
    return doGetShifts(request.get_json())

@app.route('/api/v1/shifts', methods= ['GET'])
@jwt_required
def GetShifts():
    data = {
        "start_date" : request.args.get("start_date"),
        "end_date" : request.args.get("end_date"),
        "statuses" : request.args.getlist("status")
    }
    return doGetShifts(data)


#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5002)


