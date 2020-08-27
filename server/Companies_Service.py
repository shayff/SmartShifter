#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from server.CompaniesService.Create import doCreate
from server.CompaniesService.AddEmployees import doAddEmployees
from server.CompaniesService.RemoveEmployees import doRemoveEmployees
from server.CompaniesService.ListOfEmployees import doListOfEmployees
from server.CompaniesService.Update import doUpdate
from server.CompaniesService.UpdateShift import doUpdateShift
from server.CompaniesService.addshifts import doAddShifts
from server.CompaniesService.Profile import doProfile
from server.CompaniesService.GetPreferences import doGetPreferences
from server.CompaniesService.PrefenceFromManager import doPrefenceFromManager
from server.CompaniesService.UpdateEmployee import doUpdateEmployee
from server.CompaniesService.DeleteShift import doDeleteShift
from server.CompaniesService.prefenceFromWorker import doPrefenceFromWorker
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

@app.route("/api/v1/company", methods=['POST'])
@app.route("/companies/create", methods=['POST'])
@jwt_required
def Create():
    return doCreate(request.get_json())

@app.route("/api/v1/company/employee", methods=['POST'])
@app.route("/companies/addemployees", methods=['POST'])
@jwt_required
def AddEmployees():
    return doAddEmployees(request.get_json())

@app.route("/api/v1/company/employee/<employee_id>", methods=['DELETE'])
@app.route("/companies/removeemployees", methods=['POST'])
@jwt_required
def RemoveEmployees():
    return doRemoveEmployees(request.get_json())

@app.route("/companies/updateshift", methods=['POST'])
@jwt_required
def UpdateShift():
    return doUpdateShift(request.get_json())

@app.route("/companies/addshift", methods=['POST'])
@jwt_required
def AddShifts():
    return doAddShifts(request.get_json())

@app.route("/api/v1/company/shift/<shift_id>", methods=['DELETE'])
@app.route("/companies/deleteshift", methods=['POST'])
@jwt_required
def DeleteShift():
    return doDeleteShift(request.get_json())

@app.route("/api/v1/company", methods=['PUT'])
@app.route("/companies/update", methods=['POST'])
@jwt_required
def Update():
    return doUpdate(request.get_json())

@app.route("/api/v1/company/employees", methods=['GET'])
@app.route("/companies/listofemployees", methods=['GET'])
@jwt_required
def ListOfEmployees():
    return doListOfEmployees()

@app.route("/api/v1/company", methods=['GET'])
@app.route("/companies/profile", methods=['GET'])
@jwt_required
def profile():
    return doProfile()

@app.route("/companies/updateemployee", methods=['POST'])
@jwt_required
def updateemployee():
    return doUpdateEmployee(request.get_json())



@app.route("/companies/PrefenceFromManager", methods=['POST'])
@jwt_required
def PrefenceFromManager():
    return doPrefenceFromManager(request.get_json())


@app.route("/companies/GetPreferences", methods=['GET'])
@jwt_required
def GetPreferences():
    return doGetPreferences()

@app.route("/companies/PrefenceFromWorker", methods=['POST'])
@jwt_required
def PrefenceFromWorker():
    return doPrefenceFromWorker(request.get_json())


#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5001)
