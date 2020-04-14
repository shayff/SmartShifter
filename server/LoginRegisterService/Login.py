from pymongo import MongoClient

#connect to database
cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]

def doLogin(username, password):
    result = collection.find_one({"email": username})
    if not result:
        return "Not found user"
    if result["password"] == password:
        return "Login succsesfully"
    else:
        return "Wrong password"
    return "User found"
