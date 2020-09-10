from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

GetShiftScheduled_schema = {
    "type": "object",
    "properties": {
        "start_date": {
            "type": "string"
        },
        "end_date": {
            "type": "string"
        },
        "statuses": {
            "type": "array"
        }
    },
    "required": [
        "start_date", "end_date"
    ],
    "additionalProperties": False
}

def validate_GetShifts(data):
    try:
        validate(data, GetShiftScheduled_schema)
    except ValidationError as e:
        return {"ok": False, "msg": e}
    except SchemaError as e:
        return {"ok": False, "msg": e}
    return {"ok": True, 'data': data}