#Menu
    #1. Create users
    #2. Login and get JWT
    #3. Create Company
    #4. Add employees to company
    #5. set prefernce from manager
    #6. set prefernce from workers
    #7. Create shifts
    #8. Build shift schedule

from string import Formatter
import datetime
from datetime import timedelta
from flask import json
from server.MembersService2 import app as memb_app
from server.CompaniesService2 import app as comp_app
import random
from faker import Faker

def test_Fulltest():
    #Settings
    num_of_users = 10
    start_date = datetime.datetime(year=2020, month=8, day=9)

    #Prepare test
    he_fake = Faker("he_IL")
    fake = Faker()

    users = []
    week = [start_date.strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=4)).strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
            (start_date+datetime.timedelta(days=6)).strftime("%Y-%m-%d")]

    #1. Create users
    create_users(fake,he_fake, num_of_users, users)

    #2. Login to users
    login_users(num_of_users, users)

    #3. Create company
    create_company(fake, users)

    #4. Add employees to company
    add_employees_to_company(num_of_users, users)

    #5. Set prefernce from manager
    set_prefence_from_manager(users, week)

    #6. Set prefernce from workers
    set_prefernce_from_workers(num_of_users, users, week)

    #7. Create shifts
    for day in range(7):
        for shift in range(random.randint(2, 4)):
            start,end, daypart = rand_hours_for_shift()
            response = comp_app.test_client().post(
                '/companies/addshift',
                headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
                data=json.dumps({
                "name": fake.color() + "shift",
                "start time": start,
                "end time": end,
                "job type": "waiter",
                "difficulty": random.randint(1, 5),
                "date": week[day],
                "amount": random.randint(1, 2),
                "day part": daypart,
                "employees": [],
                "note": ""
                }),
                content_type='application/json',
            )
            data = json.loads(response.get_data(as_text=True))
            assert response.status_code == 200
            assert data['ok']


def create_users(fake,he_fake, num_of_users, users):
    for i in range(num_of_users):
        user_email = fake.email()
        response = memb_app.test_client().post(
            '/register',
            data=json.dumps({"email": user_email,
                             "password": "00000",
                             "id number": "205605165",
                             "phone": he_fake.phone_number(),
                             "first name": fake.first_name(),
                             "last name": fake.last_name(),
                             "address": fake.address(),
                             "date of birth": fake.date()
                             }),
            content_type='application/json',
        )

        data = json.loads(response.get_data(as_text=True))
        users.append({"id": data['id'], "email": user_email, "token": ""})
        assert response.status_code == 200
        assert data['ok']


def login_users(num_of_users, users):
    for i in range(num_of_users):
        response = memb_app.test_client().post(
            '/login',
            data=json.dumps({"email": users[i]["email"],
                             "password": "00000"
                             }),
            content_type='application/json',
        )
        data = json.loads(response.get_data(as_text=True))
        users[i]["token"] = data["data"]["token"]
        assert response.status_code == 200
        assert data['ok']


def create_company(fake, users):
    response = comp_app.test_client().post(
        '/companies/create',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
        data=json.dumps({
            "company name": fake.company(),
            "settings" :
                {"address": fake.address(),
                 "can_employee_switch_shifts": True,
                 "shifts_required_from_emp": 5
                }
        }),
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['ok']


def add_employees_to_company(num_of_users, users):
    for i in range(1, num_of_users):
        response = comp_app.test_client().post(
            '/companies/addemployees',
            headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
            data=json.dumps({
                "employees": [
                    {
                        "email": users[i]["email"],
                        "rank": random.randint(1, 5),
                        "job type": ["waiter"]
                    }
                ]
            }),
            content_type='application/json',
        )
        data = json.loads(response.get_data(as_text=True))
        assert response.status_code == 200
        assert data['ok']


def set_prefence_from_manager(users, week):
    response = comp_app.test_client().post(
        '/companies/PrefenceFromManager',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
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
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['ok']


def set_prefernce_from_workers(num_of_users, users, week):
    for i in range(1, num_of_users):
        available, prefer = get_rand_prefers()
        data = []
        for day in range(7):
            data.append({"date": week[day],
                         "prefer": available[day],
                         "available": prefer[day]})

        response = comp_app.test_client().post(
            '/companies/PrefenceFromWorker',
            headers={'Authorization': 'Bearer {}'.format(users[i]["token"])},
            data=json.dumps({"preference": data}),
            content_type='application/json',
        )
        data = json.loads(response.get_data(as_text=True))
        assert response.status_code == 200
        assert data['ok']


def get_rand_prefers():
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
    minutes = [0, 15, 30, 45]
    time_of_shift = random.randint(5, 6)
    hour = random.randint(7, 18)
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
    start = strfdelta(start, '{H}:{M}')
    end = strfdelta(end, '{H}:{M}')
    return start, end, daypart

def strfdelta(tdelta, fmt='{D:02}d {H:02}h {M:02}m {S:02}s', inputtype='timedelta'):
    """Convert a datetime.timedelta object or a regular number to a custom-
    formatted string, just like the stftime() method does for datetime.datetime
    objects.

    The fmt argument allows custom formatting to be specified.  Fields can
    include seconds, minutes, hours, days, and weeks.  Each field is optional.

    Some examples:
        '{D:02}d {H:02}h {M:02}m {S:02}s' --> '05d 08h 04m 02s' (default)
        '{W}w {D}d {H}:{M:02}:{S:02}'     --> '4w 5d 8:04:02'
        '{D:2}d {H:2}:{M:02}:{S:02}'      --> ' 5d  8:04:02'
        '{H}h {S}s'                       --> '72h 800s'

    The inputtype argument allows tdelta to be a regular number instead of the
    default, which is a datetime.timedelta object.  Valid inputtype strings:
        's', 'seconds',
        'm', 'minutes',
        'h', 'hours',
        'd', 'days',
        'w', 'weeks'
    """

    # Convert tdelta to integer seconds.
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

