from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

asktochangeshift_schema = {
    "type": "object",
    "properties": {
        "shift": {
            "type": "integer"
        }
    },
    "required": [
        "shift"
    ],
    "additionalProperties": False
}

def validate_askToChangeShift(data):
    try:
        validate(data, asktochangeshift_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}