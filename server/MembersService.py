#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required, create_refresh_token
from MembersService.Login import doLogin
from MembersService.Register import doRegister
from bson.objectid import ObjectId

#from MembersService.Register import doRegister

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

@app.route("/")
def Home():
    return "home"

@app.route("/login", methods=['POST'])
def Login():
    #varo = doLogin(request.get_json())
    #print("varo");
    #return "bla"
    return doLogin(request.get_json())

@app.route("/profile")
@jwt_required
def profile():
    return "hello";


@app.route("/register", methods=['POST'])
def Register():
    return doRegister(request.get_json())
'''
@app.route("/logout", methods=['POST'])
def Logout():
    return doLogout()
'''

#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5000)
