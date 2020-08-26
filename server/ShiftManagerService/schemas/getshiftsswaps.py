
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

GetShiftsSwaps_schema = {
    "type": "object",
    "properties": {
        "statuses": {
            "type": "array"
        }
    },
    "required": [
        "statuses"
    ],
    "additionalProperties": False
}

def validate_GetShiftsSwaps(data):
    try:
        validate(data, GetShiftsSwaps_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}