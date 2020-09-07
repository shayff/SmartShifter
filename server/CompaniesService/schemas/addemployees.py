from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

addemployees_schema = {
    "type": "object",
    "properties": {
            "email": {
                "type": "string"
            },
            "rank": {
                "type": "integer"
            },
            "job_type": {
                "type": "array"
            },
            "time_of_joining": {
                "type": "string"
            },
            "preference" : {
                "type": "array"
            }
                },
            "required": ["email"],
            "additionalProperties": True
}


def validate_addemployees(data):
    try:
        validate(data, addemployees_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}