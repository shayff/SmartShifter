#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required,get_jwt_identity
from MembersService.Login import doLogin
from MembersService.Register import doRegister
from bson.objectid import ObjectId


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
jwt = JWTManager(app)
app.json_encoder = JSONEncoder

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'ok': False,
        'message': 'Missing Authorization Header'
    }), 401

@app.route("/")
def Home():
    return "home"

@app.route("/login", methods=['POST'])
def Login():
    return doLogin(request.get_json())

@app.route("/profile")
@jwt_required
def profile():
    current_user = get_jwt_identity()
    print(current_user)
    return "hello";


@app.route("/register", methods=['POST'])
def Register():
    return doRegister(request.get_json())


#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5000)
