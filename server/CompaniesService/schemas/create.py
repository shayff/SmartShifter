from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

create_schema = {
    "type": "object",
    "properties": {
        "company name": {
            "type": "string"
        },
        "address":{
            "type": "string"
        }
    },
    "required": [
        "company name"
    ],
    "additionalProperties": False
}

def validate_create(data):
    try:
        validate(data, create_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}