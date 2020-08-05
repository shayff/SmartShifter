#Menu
    #1. Create users
    #2. Login and get JWT
    #3. Create Company
    #4. Add employees to company
    #5. set prefernce from manager
    #6. set prefernce from workers



from flask import json
from server.MembersService2 import app as memb_app
from server.CompaniesService2 import app as comp_app
import random

from faker import Faker

def test_Fulltest():
    #Settings
    num_of_users = 3
    start_date = datetime.datetime(year=2020, month=5, day=9)

    #Prepare test
    fake = Faker()
    users = []
    week = [start_date,start_date+datetime.timedelta(days=1),start_date+datetime.timedelta(days=2),start_date+datetime.timedelta(days=3)
            ,start_date+datetime.timedelta(days=4),start_date+datetime.timedelta(days=5),start_date+datetime.timedelta(days=6)]

    #1. Create users
    for i in range(num_of_users):
        user_email = fake.email()
        response = memb_app.test_client().post(
            '/register',
            data=json.dumps({"email": user_email,
        "password":"00000",
        "id number":"205605165",
        "phone":fake.phone_number(),
        "first name": fake.first_name(),
        "last name":fake.last_name(),
        "address":fake.address(),
        "date of birth": fake.date()
    }),
            content_type='application/json',
        )

        data = json.loads(response.get_data(as_text=True))
        users.append({"id": data['id'],"email":user_email, "token": "" })
        assert response.status_code == 200
        assert data['ok']

    #Login
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

    #Create company
    response = comp_app.test_client().post(
        '/companies/create',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
        data=json.dumps({
	"company name": fake.company(),
}),
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['ok']

    #Add employees to company
    for i in range(1,num_of_users):
        response = comp_app.test_client().post(
            '/companies/addemployees',
            headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
            data=json.dumps({
        "employees": [
            {
            "email":users[i]["email"],
            "rank": random.randint(1,5),
            "job type" : ["waiter"]
            }
        ]
    }),
            content_type='application/json',
        )
        data = json.loads(response.get_data(as_text=True))
        assert response.status_code == 200
        assert data['ok']

# Add employees to company
    response = comp_app.test_client().post(
        '/companies/PrefenceFromManager',
        headers={'Authorization': 'Bearer {}'.format(users[0]["token"])},
        data=json.dumps({
        "sunday":
        {
            "date" : week[0],
            "preference" : [0,1,2]
        },
        "monday":{
            "date" : week[1],
            "preference" : [0,1,2]
        },
        "tuesday":{
            "date" : week[2],
            "preference" : [0,1,2]
        },
        "wednesday":{
            "date" : week[3],
            "preference" : [0,1,2]
        },
        "thursday":{
            "date" : week[4],
            "preference" : [0,1,2]
        },
        "friday":{
            "date" : week[5],
            "preference" : [0,1,2]
        },
        "saturday":{
            "date" : week[6],
            "preference" : [0,1,2]
        }
        }),
        content_type='application/json',
    )
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['ok']


    #6. set prefernce from workers
    for day in range(7):
        array = [0, 1, 2]
        random.shuffle(array)
        chance = random.randint(1,10)
    for _ in range(3):
        if(random.randint(1,10) > 4):
          available[day] = array.pop()
    for _ in range(3):
        if(random.randint(1,10) > 6):
          prefer[day] = array.pop()


    {"preference": [
        {"date": week[0],
         "prefer": [0],
         "available": [1]},
        {"date": "2020-07-20",
         "prefer": [0],
         "available": [1]}
    ]}