from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

sendmessage_schema = {
    "type": "object",
    "properties": {
        "to": {
            "type": "object",
            "properties": {
                "employees":{"type" : "array"},
                "shifts":{"type" : "array"},
                "dates":{"type" : "array"}
             },
            "additionalProperties": False

        },
        "title": {
            "type": "string"
        },
        "message": {
            "type": "string"
        }
    },
    "required": [
        "to",
        "title",
        "message"
    ],
    "additionalProperties": False
}

def validate_sendMessage(data):
    try:
        validate(data, sendmessage_schema)
    except ValidationError as e:
        return {'ok': False, 'msg': e}
    except SchemaError as e:
        return {'ok': False, 'msg': e}
    return {'ok': True, 'data': data}