from server.config import MongoConfig
from pymongo import MongoClient

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
users_collection = db['users']
companies_collection = db["companies"]

company_id=6

buildshift = {
        "1": [
            46,
            47
        ],
        "2": [
            48
        ],
        "3": [
            46,
            49
        ],
        "4": [
            43
        ],
        "5": [
            44
        ],
        "6": [
            48,
            50
        ],
        "7": [
            43
        ],
        "8": [
            45,
            50
        ],
        "9": [
            46,
            47
        ],
        "10": [
            43,
            45
        ],
        "11": [
            46
        ],
        "12": [
            48
        ],
        "13": [
            43,
            46
        ],
        "14": [
            44
        ],
        "15": [
            45,
            47
        ],
        "16": [
            48
        ],
        "17": [
            43
        ],
        "18": [
            46
        ],
        "19": [
            50
        ],
        "20": [
            43
        ],
        "21": [
            47,
            48
        ]
    }

company = companies_collection.find_one({'_id': company_id})
employees_dict = dict()
for emp in company["employees"]:
    employees_dict[emp["id"]] = emp

shifts_dict = dict()
for shift in company["shifts"]:
    shifts_dict[shift["id"]] = shift

print("###")
for shift_id in buildshift:
    employees = buildshift[shift_id]
    num_of_employees = len(employees)
    shift = shifts_dict[int(shift_id)]
    print(shift)
    for emp in employees:
        preference = employees_dict[emp]["preference"]
        #find the prefrence for this date
        prefer_of_given_date = next(x for x in preference if x["date"] == shift["date"])  # list of all elements with .n==30
        #assert if a is none
        prefer_of_given_date=prefer_of_given_date["prefer"]+prefer_of_given_date["available"]
        print(prefer_of_given_date)
        #print(employees_dict[emp])
    print("###")