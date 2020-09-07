import datetime, json
from server.config import FlaskConfig
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from server.CompaniesService.create_company import doCreate
from server.CompaniesService.add_employees import add_employees
from server.CompaniesService.RemoveEmployees import doRemoveEmployees
from server.CompaniesService.ListOfEmployees import doListOfEmployees
from server.CompaniesService.Update import doUpdate
from server.CompaniesService.Profile import doProfile
from server.CompaniesService.get_preferences import doGetPreferences
from server.CompaniesService.PrefenceFromManager import doPrefenceFromManager
from server.CompaniesService.UpdateEmployee import doUpdateEmployee
from server.CompaniesService.prefenceFromWorker import doPrefenceFromWorker

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
    return add_employees(request.get_json())

@app.route("/api/v1/company/employee/<employee_id>", methods=['DELETE'])
@app.route("/companies/removeemployees", methods=['POST'])
@jwt_required
def RemoveEmployees():
    return doRemoveEmployees(request.get_json())

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

@app.route("/api/v1/company/employee", methods=['PUT'])
@app.route("/companies/updateemployee", methods=['POST'])
@jwt_required
def updateemployee():
    return doUpdateEmployee(request.get_json())

@app.route("/api/v1/company/preferences", methods=['GET'])
@app.route("/companies/GetPreferences", methods=['GET'])
@jwt_required
def GetPreferences():
    return doGetPreferences()

@app.route("/api/v1/company/preference/employee", methods=['POST'])
@app.route("/companies/PrefenceFromWorker", methods=['POST'])
@jwt_required
def PrefenceFromWorker():
    return doPrefenceFromWorker(request.get_json())

@app.route("/api/v1/company/preference/manager", methods=['POST'])
@app.route("/companies/PrefenceFromManager", methods=['POST'])
@jwt_required
def PrefenceFromManager():
    return doPrefenceFromManager(request.get_json())


#delete after we will change urls

@app.route("/companies/updateshift", methods=['POST'])
@jwt_required
def UpdateShift():
    return update_shift(request.get_json())

@app.route("/companies/addshift", methods=['POST'])
@jwt_required
def AddShifts():
    return create_shift(request.get_json())

@app.route("/companies/deleteshift", methods=['POST'])
@jwt_required
def DeleteShift():
    return delete_shifts(request.get_json())



#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5001)


