from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

setshiftsschedule_schema = {
    "type": "object",
    "properties": {
        "data": {
            "type": "array"
        },
    },
    "required": [
        "data"
    ],
    "additionalProperties": False
}

def validate_setshiftsschedule(data):
    try:
        validate(data, setshiftsschedule_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}