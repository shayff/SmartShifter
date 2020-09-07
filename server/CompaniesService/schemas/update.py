from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


update_schema = {
    "type": "object",
    "properties": {
        "company_name": {
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
                        "start_time": {
                        "type": "string"
                      },
                        "end_time": {
                        "type": "string"
                        }
                    },
                    "required": ["id","name","start_time", "end_time"]
                  }
                },
        "shifts":
            {
                "type": "array"
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