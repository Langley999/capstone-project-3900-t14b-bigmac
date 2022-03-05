from werkzeug.exceptions import HTTPException

class BadReqError(HTTPException):
    code = 400
    message = "unknown error"

class AccessError(HTTPException):
    code = 400
    message = "unknown error"

class InputError(HTTPException):
    code = 400
    message = "unknown error"
