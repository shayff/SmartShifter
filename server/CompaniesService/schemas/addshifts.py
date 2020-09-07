from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


addshifts_schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "start_time": {
            "type": "string"
        },
        "end_time": {
            "type": "string"
        },
        "job_type": {
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
        "day_part": {
            "type": "array"
        },
        "employees": {
          "type": "array"
        },
        "note": {
            "type": "string"
        }
    },
    "required": ["name", "start_time", "end_time", "job_type",	"difficulty", "date", "amount", "day_part"],
    "additionalProperties": False
}

def validate_create_shift(data):
    try:
        validate(data, addshifts_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}