from flask import Flask
from flask import request
from flask_jwt_extended import JWTManager
from LoginRegisterService.Login import doLogin
from LoginRegisterService.Register import doRegister

app = Flask(__name__)
@app.route("/login", methods=['POST'])
def Login():
    return doLogin(request.headers.get('username'), request.headers.get('password'))

@app.route("/logout", methods=['POST'])
def Logout():
    return doLogout()

@app.route("/register", methods=['POST'])
def Register():
    return doRegister()



#for dubg
if __name__== '__main__':
    app.run(debug=True, port=5000)
