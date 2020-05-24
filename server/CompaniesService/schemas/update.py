from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


update_schema = {
    "type": "object",
    "properties": {
        "company name": {
            "type": "string"
        },
        "day parts":
                {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                      "name": {
                        "type": "string"
                      },
                        "start time": {
                        "type": "string"
                      },
                        "end time": {
                        "type": "string"
                        }
                    },
                    "required": ["id","name","start time", "end time"]
                  }
                },
        "shifts":
            {
                "type": "array"
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