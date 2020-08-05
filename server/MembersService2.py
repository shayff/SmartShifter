#from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
import json
from flask_jwt_extended import JWTManager, jwt_required, get_raw_jwt
from server.MembersService.Login import doLogin
from server.MembersService.Register import doRegister
from server.MembersService.SendMessage import doSendMessage
from server.MembersService.GetMessage import doGetMessages
from server.MembersService.Profile import doProfile
from server.MembersService.UpdateMessage import doUpdateMessage
from server.MembersService.UpdateProfile import doUpdateProfile
from flask_cors import CORS
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
cors = CORS(app)
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
    return 'hello eliran'

@app.route("/login", methods=['POST'])
def Login():
    return doLogin(request.get_json())

@app.route("/logout")
@jwt_required
def Logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200

@app.route("/profile", methods=['GET'])
@jwt_required
def profile():
    return doProfile()

@app.route('/register', methods=['POST'])
def Register():
    return doRegister(request.get_json())

@app.route('/updateprofile', methods=['POST'])
@jwt_required
def profileUpdate():
    return doUpdateProfile(request.get_json())

@app.route('/sendmessage', methods=['POST'])
@jwt_required
def SendMessage():
    return doSendMessage(request.get_json())

@app.route('/getmessage', methods=['GET'])
@jwt_required
def GetMessages():
    return doGetMessages()

@app.route('/updatemessage',methods=['POST'])
@jwt_required
def UpdateMessage():
    return doUpdateMessage(request.get_json())


#for debug
if __name__== '__main__':
    app.run(debug=True, port=5000)