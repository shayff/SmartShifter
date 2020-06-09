from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

confirmshiftswap_schema = {
    "type": "object",
    "properties": {
        "swap_id": {
            "type": "integer"
        }
    },
    "required": [
        "swap_id"
    ],
    "additionalProperties": False
}

def validate_confirmShiftSwap(data):
    try:
        validate(data, confirmshiftswap_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}