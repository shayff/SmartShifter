import datetime, json
from server.config import FlaskConfig
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_raw_jwt
from flask_cors import CORS
from server.MembersService.login import doLogin
from server.MembersService.Register import doRegister
from server.MembersService.send_message import send_message
from server.MembersService.get_message import get_messages
from server.MembersService.get_sent_messages import get_sent_messages
from server.MembersService.get_profile import get_profile
from server.MembersService.update_message_status import update_message_status
from server.MembersService.update_user import update_user
from server.MembersService.change_password import change_password

from bson.objectid import ObjectId

app = Flask(__name__, static_folder='./build', static_url_path='/')

#app = Flask(__name__)

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
        'message': 'Missing Authorization Header'
    }), 401

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/api/v1/login", methods=["POST"])
@app.route("/login", methods=["POST"])
def Login():
    return doLogin(request.get_json())

@app.route("/api/v1/logout")
@app.route("/logout")
@jwt_required
def Logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out"}), 200

@app.route("/api/v1/user/profile", methods=['GET'])
@app.route("/profile", methods=['GET'])
@jwt_required
def profile():
    return get_profile()

@app.route('/api/v1/user', methods=["POST"])
def Register():
    return doRegister(request.get_json())

@app.route('/api/v1/user/password', methods=['PUT'])
@app.route('/changepassword', methods=["POST"])
@jwt_required
def ChangePassword():
    return change_password(request.get_json())

@app.route('/api/v1/user', methods=['PUT'])
@app.route('/updateprofile', methods=["POST"])
@jwt_required
def profileUpdate():
    return update_user(request.get_json())

@app.route('/api/v1/message', methods=["POST"])
@app.route('/sendmessage', methods=["POST"])
@jwt_required
@jwt_required
def SendMessage():
    return send_message(request.get_json())

@app.route('/api/v1/messages', methods=['GET'])
@app.route('/getmessage', methods=['GET'])
@jwt_required
def GetMessages():
    return get_messages()

@app.route('/api/v1/message/status',methods=['PUT'])
@app.route('/updatemessage',methods=["POST"])
@jwt_required
def UpdateMessage():
    return update_message_status(request.get_json())

@app.route('/api/v1/messages/sent',methods=['GET'])
@jwt_required
def get_sent_message():
    return get_sent_messages()

#for debug
if __name__== '__main__':
    app.run(debug=True, port=5000)