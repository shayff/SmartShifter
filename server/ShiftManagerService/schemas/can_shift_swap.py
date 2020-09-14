from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

canshiftswap_schema = {
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

def validate_CanShiftSwap(data):
    try:
        validate(data, canshiftswap_schema)
    except ValidationError as e:
        return {"ok": False, "msg": e}
    except SchemaError as e:
        return {"ok": False, "msg": e}
    return {"ok": True, 'data': data}