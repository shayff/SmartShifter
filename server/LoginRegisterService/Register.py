import LoginRegisterService
import json
from pymongo import MongoClient
cluster = MongoClient("mongodb+srv://test:tester123@cluster0-pnljo.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["shifter_db"]
collection = db["users"]



def insert_New_User(myjson):
   myjson['Email']=myjson['Email'].lower()
   print(myjson)
   result = collection.find_one({'Email': myjson["Email"]})
   if result:
       return "There is already user with this email"
   else:
      count_doc = collection.count_documents({})
      y = {"_id": count_doc+1}
      myjson.update(y)
      collection.insert_one(myjson)
      return "succses"



