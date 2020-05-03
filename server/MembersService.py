#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required,get_jwt_identity,get_raw_jwt
from MembersService.Login import doLogin
from MembersService.Register import doRegister
from MembersService.SendMessage import doSendMessage
from MembersService.GetMessage import doGetMessages
from bson.objectid import ObjectId

from server.MembersService.UpdateProfile import doUpdateProfile


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
        'message': 'Missing Authorization Header'
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route("/")
def main():
    return "hello eliran"

@app.route("/login", methods=['POST'])
def Login():
    return doLogin(request.get_json())

@app.route("/logout")
@jwt_required
def Logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200

@app.route("/profile")
@jwt_required
def profile():
    current_user = get_jwt_identity()
    print(current_user)
    return "hello2";

@app.route("/register", methods=['POST'])
def Register():
    return doRegister(request.get_json())

@app.route('/updateprofile', methods=['POST'])
@jwt_required
def profileUpdate():
    return doUpdateProfile(request.get_json())
''''
@app.route('/listofemployees', methods=['GET'])
@jwt_required
def listOfEmployees():
    return doListOfEmployees()
'''

@app.route('/sendmessage', methods=['POST'])
@jwt_required
def SendMessage():
    return doSendMessage(request.get_json())

@app.route('/getmessage', methods=['GET'])
@jwt_required
def GetMessages():
    return doGetMessages()


#for debug
if __name__== '__main__':
    app.run(debug=True, port=5000)
