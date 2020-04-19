from pymongo import MongoClient

#connect to database
cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]

def doLogin( username, password):
    try:
        result = collection.find_one({"email": username})
    except:
        return {'status': False, 'msg': 'DB Error'}
    if not result:
        return {'status': False, 'msg': 'User not found'}
    if result["password"] == password:
        return {'status': True, 'data': result}
    else:
        return {'status': False, 'msg': 'Wrong Password'}
