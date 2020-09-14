from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

change_password_schema = {
    "type": "object",
    "properties": {
        "current_password": {
            "type": "string",
            "minLength": 5
        },
        "new_password": {
            "type": "string",
            "minLength": 5
        },
    },
    "required": ["current_password", "new_password"],
    "additionalProperties": False
}

def validate_changePassword(data):
    try:
        validate(data, change_password_schema)
    except ValidationError as e:
        return {"ok": False, "msg": e}
    except SchemaError as e:
        return {"ok": False, "msg": e}
    return {"ok": True, 'data': data}