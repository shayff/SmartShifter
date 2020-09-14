from string import Formatter
import datetime, random
from server.config import MongoConfig
from pymongo import MongoClient
from datetime import timedelta
from flask import json
from server.Members_Service import app as memb_app
from server.Companies_Service import app as comp_app
from server.ShiftManager_Service import app as shift_app
from faker import Faker

cluster = MongoClient(MongoConfig['ConnectionString'])
db = cluster[MongoConfig['ClusterName']]
companies_collection = db["companies"]


def test_Fulltest():

    # init data for test
    fake, he_fake, num_of_users, users, week = init_data_for_test()

    #1. Create users
    print("========= Create Usesrs =========")
    create_users(fake,he_fake, num_of_users, users)

    #2. Login to users
    login_users(num_of_users, users)

    #3. Create company
    print("========= Create Company =========")
    company_id = create_company(fake, users)

    #4. Add employees to company
    add_employees_to_company(num_of_users, users)

    #5. Set prefernce from manager
    set_prefence_from_manager(users, week)

    #6. Send messages
    send_messages_to_employee(users)

    #7. Set prefernce from workers
    set_prefernce_from_workers(num_of_users, users, week)

    #8. Create shifts
    print("========= Create Shifts =========")
    create_shifts(fake, users, week)

    #9. Run and check builld shift
    data = run_build_shift(users, week)
    check_build_shift(data["data"], company_id)


def init_data_for_test():
    # num of user to create
    num_of_users = 10
    users = []
    # init the fake data library
    he_fake = Faker("he_IL")
    fake = Faker()
    start_date = get_next_sunday()  # get the start date
    week = [start_date.strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=4)).strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
            (start_date + datetime.timedelta(days=6)).strftime("%Y-%m-%d")]
    return fake, he_fake, num_of_users, users, week


def run_build_shift(users, week):
    '''
    This function run the build shift algorithem
    '''
    response = shift_app.test_client().post(
        '/api/v1/shifts/build',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
        data=json.dumps({
            "start_date": week[0],
            "end_date": week[6]
        }),
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data["ok"]
    return data


def get_next_sunday():
    '''
    This function return the next sunday
    '''
    date = datetime.date.today()
    if date.weekday() == 6:
        return date + datetime.timedelta(7)
    while date.weekday() != 6:
        date += datetime.timedelta(1)
    return date

def create_shifts(fake, users, week):
    '''
    This function create new shifts
    '''
    for day in range(7):
        for shift in range(random.randint(2, 4)):
            start, end, daypart = rand_hours_for_shift()
            response = shift_app.test_client().post(
                '/api/v1/shift',
                headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
                data=json.dumps({
                    "name": fake.color() + "shift",
                    "start_time": start,
                    "end_time": end,
                    "job_type": "waiter",
                    "difficulty": random.randint(1, 5),
                    "date": week[day],
                    "amount": random.randint(1, 2),
                    "day_part": daypart,
                    "employees": [],
                    "note": ""
                }),
                content_type='application/json',
            )
            data = json.loads(response.get_data(as_text=True))
            assert response.status_code == 200
            assert data["ok"]


def create_users(fake,he_fake, num_of_users, users):
    '''
    This function create new users
    '''
    for i in range(num_of_users):
        user_email = fake.email()
        response = memb_app.test_client().post(
            '/api/v1/user',
            data=json.dumps({"email": user_email,
                             "password": "00000",
                             "id_number": str(random.randint(100000000, 999999999)),
                             "phone": he_fake.phone_number().replace('-', ''),
                             "first_name": fake.first_name(),
                             "last_name": fake.last_name(),
                             "address": fake.street_name() + ", " + fake.city(),
                             "date_of_birth": fake.date()
                             }),
            content_type='application/json',
        )

        data = json.loads(response.get_data(as_text=True))
        users.append({"id": data["id"], "email": user_email, "token": ""})
        assert response.status_code == 200
        assert data["ok"]


def login_users(num_of_users, users):
    '''
    This function login to the given users, we do it to save the JWT token for each user.
    '''
    for i in range(num_of_users):
        response = memb_app.test_client().post(
            '/api/v1/login',
            data=json.dumps({"email": users[i]["email"],
                             "password": "00000"
                             }),
            content_type='application/json',
        )
        data = json.loads(response.get_data(as_text=True))
        users[i]["token"] = data["data"]["token"]
        assert response.status_code == 200
        assert data["ok"]

def create_company(fake, users):
    '''
    This function create new company
    '''
    response = comp_app.test_client().post(
        '/api/v1/company',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
        data=json.dumps({
            "company_name": fake.company(),
            "settings" :
                {"address": fake.address(),
                 "can_employee_switch_shifts": True,
                 "shifts_required_from_emp": 5
                },
            "roles" : ["waiter"]
        }),
        content_type="application/json",
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data["ok"]
    return data["data"]["_id"]


def add_employees_to_company(num_of_users, users):
    '''
    This function add the given employees to the company
    '''
    for i in range(1, num_of_users):
        response = comp_app.test_client().post(
            "/api/v1/company/employee",
            headers={"Authorization": "Bearer {}".format(users[0]["token"])},
            data=json.dumps({
                        "email": users[i]["email"],
                        "rank": random.randint(1, 5),
                        "job_type": ["waiter"]
                                }),
            content_type="application/json",
        )
        data = json.loads(response.get_data(as_text=True))
        assert response.status_code == 200
        assert data["ok"]

def send_messages_to_employee(users):
    '''
    This function send message to all employees (except the manager)
    '''
    users_id = [user["id"] for user in users]
    users_id.pop(0)

    response = memb_app.test_client().post(
        "/api/v1/message",
        headers={"Authorization": "Bearer {}".format(users[0]["token"])},
        data=json.dumps({
            "to" : {"employees": users_id},
            "title" : "wellcome to shifter",
            "message" : "Hope you will have fun from this test!"
        }),
        content_type="application/json",
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data["ok"]

def set_prefence_from_manager(users, week):
    '''
    This function send the prefence the manager need from the employees
    '''
    response = comp_app.test_client().post(
        "/api/v1/company/preference/manager",
        headers={"Authorization": "Bearer {}".format(users[0]["token"])},
        data=json.dumps({
            "sunday":
                {
                    "date": week[0],
                    "preference": [0, 1, 2]
                },
            "monday": {
                "date": week[1],
                "preference": [0, 1, 2]
            },
            "tuesday": {
                "date": week[2],
                "preference": [0, 1, 2]
            },
            "wednesday": {
                "date": week[3],
                "preference": [0, 1, 2]
            },
            "thursday": {
                "date": week[4],
                "preference": [0, 1, 2]
            },
            "friday": {
                "date": week[5],
                "preference": [0, 1, 2]
            },
            "saturday": {
                "date": week[6],
                "preference": [0, 1, 2]
            }
        }),
        content_type="application/json",
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data["ok"]

def set_prefernce_from_workers(num_of_users, users, week):
    '''
    This function set the prefernce of the employee
    '''
    for i in range(1, num_of_users):
        available, prefer = get_rand_prefers()
        data = []
        for day in range(7):
            data.append({"date": week[day],
                         "prefer": available[day],
                         "available": prefer[day]})

        response = comp_app.test_client().post(
            "/api/v1/company/preference/employee",
            headers={"Authorization": "Bearer {}".format(users[i]["token"])},
            data=json.dumps({"preference": data}),
            content_type="application/json",
        )
        data = json.loads(response.get_data(as_text=True))
        assert response.status_code == 200
        assert data["ok"]

def get_rand_prefers():
    '''
    This function randomize the preference for the employees
    '''
    available = [[],[],[],[],[],[],[]]
    prefer = [[],[],[],[],[],[],[]]

    for day in range(7):
        array = [0, 1, 2]
        random.shuffle(array)
        for _ in range(3):
            if (random.randint(1, 10) > 4):
                available[day].append(array.pop())
        for _ in range(len(array)):
            if (random.randint(1, 10) > 4):
                prefer[day].append(array.pop())
    return available, prefer

def rand_hours_for_shift():
    '''
    This function randomize start time and end time for shifts
    '''
    minutes = [0, 15, 30, 45]
    time_of_shift = random.randint(5, 6)
    hour = random.randint(6, 17)
    start = timedelta(hours=hour, minutes=minutes[random.randint(0, 3)])
    end = start + timedelta(hours=time_of_shift)
    daypart = set()
    if (start < timedelta(hours=12)):
        daypart.add(0)
    elif (start < timedelta(hours=18)):
        daypart.add(1)
    else:
        daypart.add(2)
    if (end > timedelta(hours=16)):
        daypart.add(2)
    elif (end > timedelta(hours=12)):
        daypart.add(1)
    else:
        daypart.add(0)
    daypart = list(daypart)
    start = strfdelta(start, '{H:02}:{M:02}')
    end = strfdelta(end, '{H:02}:{M:02}')
    return start, end, daypart

def strfdelta(tdelta, fmt='{D:02}d {H:02}h {M:02}m {S:02}s', inputtype='timedelta'):
    # convert time to our format
    if inputtype == 'timedelta':
        remainder = int(tdelta.total_seconds())
    elif inputtype in ['s', 'seconds']:
        remainder = int(tdelta)
    elif inputtype in ['m', 'minutes']:
        remainder = int(tdelta)*60
    elif inputtype in ['h', 'hours']:
        remainder = int(tdelta)*3600
    elif inputtype in ['d', 'days']:
        remainder = int(tdelta)*86400
    elif inputtype in ['w', 'weeks']:
        remainder = int(tdelta)*604800

    f = Formatter()
    desired_fields = [field_tuple[1] for field_tuple in f.parse(fmt)]
    possible_fields = ('W', 'D', 'H', 'M', 'S')
    constants = {'W': 604800, 'D': 86400, 'H': 3600, 'M': 60, 'S': 1}
    values = {}
    for field in possible_fields:
        if field in desired_fields and field in constants:
            values[field], remainder = divmod(remainder, constants[field])
    return f.format(fmt, **values)

def check_build_shift(buildshift, company_id):

    # get data of employees and shifs
    company = companies_collection.find_one({"_id": company_id})
    employees_dict = dict()
    for emp in company["employees"]:
        employees_dict[emp["id"]] = emp

    shifts_dict = dict()
    for shift in company["shifts"]:
        shifts_dict[shift["id"]] = shift


    # loop through all shifts
    for shift_id in buildshift:
        employees = buildshift[shift_id]
        shift = shifts_dict[int(shift_id)]

        # loop through all employees in shift
        for emp in employees:
            preference = employees_dict[emp]["preference"]

            # find the prefrence for this date
            prefer_of_given_date = next(x for x in preference if x["date"] == shift["date"])

            # if there is no prefer at all this is error
            assert prefer_of_given_date

            # if we do, we save the part of the day the employee gave
            prefer_of_given_date = set(prefer_of_given_date["prefer"] + prefer_of_given_date["available"])

            # check if the shift day part are in employee prefer (if the emplyee ask to work in that part of day)
            assert (set(shift["day_part"]).issubset(prefer_of_given_date))