from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


deleteshift_schema = {
    "type": "object",
    "properties": {
        "id": {
             "type": "array"
        }
    },
    "required": ["id"],
    "additionalProperties": False
}

def validate_deleteshift(data):
    try:
        validate(data, deleteshift_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}