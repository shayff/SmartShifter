from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

register_schema = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "minLength": 5
        },
        "id number": {
            "type": "string",
            "minLength": 8
        },
        "phone": {
            "type": "string"
        },
        "first name": {
            "type": "string"
        },
        "last name": {
            "type": "string"
        },
        "address": {
            "type": "string"
        },
        "date of birth": {
            "type": "string"
        },
        "gender":{
            "type": "string"
        }
    },
    "required": [
        "email",
        "password",
        "id number",
        "phone",
        "first name",
        "last name"
    ],
    "additionalProperties": False
}

def validate_register(data):
    try:
        validate(data, register_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}