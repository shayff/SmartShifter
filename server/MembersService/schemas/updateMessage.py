from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

updatemessage_schema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "status": {
            "type": "string"
        }
    },
    "required": ["id", "status"],
    "additionalProperties": False
}

def validate_updatemessage(data):
    try:
        validate(data, updatemessage_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}