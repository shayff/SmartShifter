from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

create_schema = {
    "type": "object",
    "properties": {
        "company_name": {
            "type": "string"
        },
        "settings":
        {
            "type": "object"
        },
        "roles":
            {
                "type": "array"
            }
    },
    "required": [
        "company_name"
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