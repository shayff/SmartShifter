from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

removeemployees_schema = {
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

def validate_removeemployees(data):
    try:
        validate(data, removeemployees_schema)
    except ValidationError as e:
        return {"ok": False, "msg": e}
    except SchemaError as e:
        return {"ok": False, "msg": e}
    return {"ok": True, 'data': data}