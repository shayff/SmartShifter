from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

updateProfile_schema = {
    "type": "object",
    "properties": {
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
        }

    },
    "additionalProperties": False
}

def validate_updateProfile(data):
    try:
        validate(data, updateProfile_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}