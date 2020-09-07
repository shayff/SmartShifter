from flask import json
from server.Members_Service import app
from faker import Faker

def test_do_register():
    fake = Faker()
    response = app.test_client().post(
        '/register',
        data=json.dumps({"email":fake.email(),
	"password":"00000",
	"id_number":'123456789',
	"phone":fake.phone_number(),
	"first_name": fake.first_name(),
	"last_name":fake.last_name(),
	"address":fake.address(),
	"date_of_birth": fake.profile()["birthdate"]
}),
        content_type='application/json',
    )

    print(response)
    data = json.loads(response.get_data(as_text=True))
    print(data)
    assert response.status_code == 200
    assert data['ok']

