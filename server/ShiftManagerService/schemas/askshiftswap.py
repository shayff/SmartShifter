from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

askshiftswap_schema = {
    "type": "object",
    "properties": {
        "shift_id": {
            "type": "integer"
        }
    },
    "required": [
        "shift_id"
    ],
    "additionalProperties": False
}

def validate_askShiftSwap(data):
    try:
        validate(data, askshiftswap_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}