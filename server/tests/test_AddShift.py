import datetime
from datetime import timedelta
from flask import json
from server.Members_Service import app as memb_app
from server.Companies_Service import app as comp_app
import random




from faker import Faker



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
    start = str(start)
    end = str(end)
    return start, end, daypart


#Settings
num_of_users = 10
start_date = datetime.datetime(year=2020, month=8, day=9)
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY3MjI4NzUsIm5iZiI6MTU5NjcyMjg3NSwianRpIjoiYzVhZTYwNDItZTA1My00ZDU0LTgxMjgtNDUyNmNmNTZmMGY2IiwiZXhwIjoxNTk2ODA5Mjc1LCJpZGVudGl0eSI6eyJfaWQiOjIyLCJhZGRyZXNzIjoiMTk5IEtpZGQgVHJhY2UgQXB0LiA4NDRcbkxha2UgVGltb3RoeSwgTkMgNTYyMTIiLCJkYXRlIG9mIGJpcnRoIjoiMjAxNC0wOS0xMiIsImVtYWlsIjoic2hha2lyYUBnbWFpbC5jb20iLCJmaXJzdCBuYW1lIjoiTmVseSIsImlkIG51bWJlciI6IjIwNTYwNTE2NSIsImxhc3QgbmFtZSI6Ik5laE5laCIsInBob25lIjoiMDU5NTc4Mjc2MCIsInRpbWVfY3JlYXRlZCI6IlRodSBBdWcgIDYgMTU6MTE6MDcgMjAyMCIsIm1lc3NhZ2VzIjpbXSwiY29tcGFueSI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.c5pPKwpZCov31Yd82Of4aJqVwccaAc2Mxpxs_7J3bHc"
#Prepare test

week = [start_date.strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=4)).strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
        (start_date + datetime.timedelta(days=6)).strftime("%Y-%m-%d")]

fake = Faker()

# 7. Create shifts
for day in range(7):
    for shift in range(random.randint(2, 4)):
        start, end, daypart = rand_hours_for_shift()
        response = comp_app.test_client().post(
            '/companies/addshift',
            headers={'Authorization': 'Bearer {}'.format(token)},
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
        assert data['ok']

