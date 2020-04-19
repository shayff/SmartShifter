from config import FlaskConfig
from flask import Flask, request, jsonify
import datetime
from flask_jwt_extended import JWTManager, jwt_required, create_refresh_token
from schemas import validate_register
from LoginRegisterService.Login import doLogin
#from LoginRegisterService.Register import doRegister


app = Flask(__name__)
app.config['SECRET_KEY'] = 'JustDemonstrating'
app.config['JWT_SECRET_KEY'] = "1asdasd#$$!1ddX"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)


@app.route("/")
def Home():
    return "home"


@app.route("/login", methods=['POST'])
def Login():
    result = doLogin(request.headers.get('username'), request.headers.get('password'))
    if(result['status']):
        create_refresh_token(identity=result['data']['_id'])
        return "connected"
    else:
        return "not"


@app.route("/profile")
@jwt_required
def profile():
    return "hello";


@app.route("/register", methods=['POST'])
def Register():
    data = validate_register(request.get_json())
    if data["status"]:
        return "valid"
    else:
        return "error"
'''
@app.route("/logout", methods=['POST'])
def Logout():
    return doLogout()
'''

#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5000)
