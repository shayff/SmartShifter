import LoginRegisterService
import json


json_string = """
{
"type": "object",
    "properties": {
        "Email":"aaaaa" ,
        "Password": "aaaa",
        "Id Number": "21312414",
        "Phone": "0542011196",
        "First Name": "aaaa",
        "Last Name": "aadc",
        "Address": "AvdvsdV",
        "Date of birth":"20.11.1990" 
}
"""

def insert_New_User(myjson,count):
   result = records.find_one({'Email': myjson["Email"]})
   if result:
       return False
   else:
       temp = myjson['properties']
       y = {"_id":count+1}
       temp.update(y)
       collection.insertOne(myjson)


count_doc = collection.count_documents({})
insert_New_User(json_string,count_doc)

