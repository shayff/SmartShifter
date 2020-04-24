from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

addemployees_schema = {
    "type": "object",
    "properties": {
        "employees": {
            "type": "array"
        }
    },
    "required": [
        "employees"
    ],
    "additionalProperties": False
}

def validate_addemployees(data):
    try:
        validate(data, addemployees_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}