from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

register_schema = {
    "type": "object",
    "properties": {
        "Email": {
            "type": "string",
            "format": "email"
        },
        "Password": {
            "type": "string",
            "minLength": 8
        },
        "Id Number": {
            "type": "string",
            "minLength": 8
        },
        "Phone": {
            "type": "string"
        },
        "First Name": {
            "type": "string"
        },
        "Last Name": {
            "type": "string"
        },
        "Address": {
            "type": "string"
        },
        "Date of birth": {
            "type": "string"
        }

    },
    "required": [
        "Email",
        "Password",
        "Id Number",
        "Phone",
        "First Name",
        "Last Name"
    ],
    "additionalProperties": False
}

def validate_register(data):
    try:
        validate(data, register_schema)
    except ValidationError as e:
        return {'status': False, 'message': e}
    except SchemaError as e:
        return {'status': False, 'message': e}
    return {'status': True, 'data': data}