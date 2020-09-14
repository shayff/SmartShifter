from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

PrefenceFromManager_schema = {
    "type": "object",
    "properties": {
        "dates": {
            {
                "type": "array"
                "items":

            }
        }
    },
    "additionalProperties": False
}



def validate_PrefenceFromManager(data):
    try:
        validate(data, PrefenceFromManager_schema)
    except ValidationError as e:
        return {"ok": False, "msg": e}
    except SchemaError as e:
        return {"ok": False, "msg": e}
    return {"ok": True, 'data': data}