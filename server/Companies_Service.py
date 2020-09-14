import datetime, json
from server.config import FlaskConfig
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from bson.objectid import ObjectId
from server.CompaniesService.create_company import create_company
from server.CompaniesService.add_employees import add_employees
from server.CompaniesService.remove_employees_from_company import remove_employees_from_company
from server.CompaniesService.get_list_of_employees import get_list_of_employees
from server.CompaniesService.update_company import update_company
from server.CompaniesService.get_company import get_company
from server.CompaniesService.get_preferences import get_preferences
from server.CompaniesService.set_prefence_from_manager import set_prefence_from_manager
from server.CompaniesService.update_employee import update_employee
from server.CompaniesService.set_prefence_from_employee import set_prefence_from_employee

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
        "msg": "Missing Authorization Header"
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route("/api/v1/company", methods=["POST"])
@jwt_required
def Create():
    return create_company(request.get_json())

@app.route("/api/v1/company", methods=["GET"])
@jwt_required
def profile():
    return get_company()

@app.route("/api/v1/company", methods=["PUT"])
@jwt_required
def Update():
    return update_company(request.get_json())

@app.route("/api/v1/company/employee", methods=["POST"])
@jwt_required
def AddEmployees():
    return add_employees(request.get_json())

@app.route("/api/v1/company/employee", methods=["DELETE"])
@jwt_required
def RemoveEmployees():
    return remove_employees_from_company(request.get_json())

@app.route("/api/v1/company/employees", methods=["GET"])
@jwt_required
def ListOfEmployees():
    return get_list_of_employees()

@app.route("/api/v1/company/employee", methods=["PUT"])
@jwt_required
def updateemployee():
    return update_employee(request.get_json())

@app.route("/api/v1/company/preferences", methods=['GET'])
@jwt_required
def GetPreferences():
    return get_preferences()

@app.route("/api/v1/company/preference/employee", methods=["POST"])
@jwt_required
def PrefenceFromWorker():
    return set_prefence_from_employee(request.get_json())

@app.route("/api/v1/company/preference/manager", methods=["POST"])
@jwt_required
def PrefenceFromManager():
    return set_prefence_from_manager(request.get_json())

if __name__== '__main__':
    app.run(debug=True, port=5001)


