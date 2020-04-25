from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

update_schema = {
    "type": "object",
    "properties": {
        "company name": {
            "type": "string"
        }
    },
    "required": [],
    "additionalProperties": False
}

def validate_update(data):
    try:
        validate(data, update_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}