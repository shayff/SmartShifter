from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

buildshift_schema = {
    "type": "object",
    "properties": {
        "start_date": {
            "type": "string"
        },
        "end_date": {
            "type": "string"
        },
        "pre_scheduled": {
            "type": "array",
            'items': {
                        "type": "object",
                        "properties": {
                            "shift_id":{"type" : "integer"},
                            "employee_id":{"type" : "integer"}
                        }
            }
        }
    },
    "required": [
        "start_date" , "end_date"
    ],
    "additionalProperties": False
}

def validate_buildShift(data):
    try:
        validate(data, buildshift_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}