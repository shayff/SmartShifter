#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from CompaniesService.Create import doCreate
from CompaniesService.AddEmployees import doAddEmployees
from CompaniesService.RemoveEmployees import doRemoveEmployees
from CompaniesService.ListOfEmployees import doListOfEmployees
from CompaniesService.Update import doUpdate
from CompaniesService.UpdateShift import doUpdateShift
from CompaniesService.addshifts import doAddShifts
from CompaniesService.Profile import doProfile
#from CompaniesService.UpdateProfile import doUpdateProfile
from CompaniesService.UpdateEmployee import doUpdateEmployee
from server.CompaniesService.DeleteShift import doDeleteShift
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

@app.route("/create", methods=['POST'])
@jwt_required
def Create():
    return doCreate(request.get_json())

@app.route("/companies/addemployees", methods=['POST'])
@jwt_required
def AddEmployees():
    return doAddEmployees(request.get_json())

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

@app.route("/companies/deleteshift", methods=['POST'])
@jwt_required
def DeleteShift():
    return doDeleteShift(request.get_json())

@app.route("/companies/update", methods=['POST'])
@jwt_required
def Update():
    return doUpdate(request.get_json())

@app.route("/companies/listofemployees", methods=['GET'])
@jwt_required
def ListOfEmployees():
    return doListOfEmployees()

@app.route("/companies/profile", methods=['GET'])
@jwt_required
def profile():
    return doProfile()

@app.route("/companies/updateemployee", methods=['POST'])
@jwt_required
def updateemployee():
    return doUpdateEmployee(request.get_json())

#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5001)
