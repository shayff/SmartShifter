from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


updateemployee_schema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "rank":{
            "type": "integer"
        },
        "job type":{
            "type": "array"
        }
    },
    "required": ["id"],
    "additionalProperties": False
}

def validate_updateemployee(data):
    try:
        validate(data, updateemployee_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}