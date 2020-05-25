from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


addshifts_schema = {
    "type": "object",
    "properties": {
        "day": {
             "type": "string"
        },
        "name": {
            "type": "string"
        },
        "start time": {
            "type": "string"
        },
        "end time": {
            "type": "string"
        },
        "job type": {
            "type": "string"
        },
        "difficulty": {
            "type": "integer"
        },
        "date": {
            "type": "string"
        },
        "amount": {
            "type": "integer"
        },
        "day part": {
            "type": "integer"
        },
        "employees": {
          "type": "array"
        },
        "note": {
            "type": "string"
        }
    },
    "required": ["day", "name", "start time", "end time", "job type",	"difficulty", "date", "amount", "day part"],
    "additionalProperties": False
}

def validate_addshifts(data):
    try:
        validate(data, addshifts_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}