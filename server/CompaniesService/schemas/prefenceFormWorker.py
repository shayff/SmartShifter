from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


prefenceFromWorker_schema = {
    "type": "object",
    "properties": {
        "preference": {
            "type": "array",
            'items': {
                        "type": "object",
                        "properties": {
                            "date":{"type" : "string"},
                            "prefer":{"type" : "array"},
                            "available":{"type" : "array"}
                        }
            }
    }},
    "required": ["preference"],
    "additionalProperties": False
}

def validate_prefenceFromWorker(data):
    try:
        validate(data, prefenceFromWorker_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}