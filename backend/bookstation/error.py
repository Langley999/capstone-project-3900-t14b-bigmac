from werkzeug.exceptions import HTTPException

class BadReqError(HTTPException):
    code = 400
    message = "unknown bad req error"

class AccessError(HTTPException):
    code = 400
    message = "unknown access error"

class InputError(HTTPException):
    code = 400
    message = "unknown input error"

class PermissionError(HTTPException):
    code = 400
    message = "unknown perssion error"
<<<<<<< HEAD
=======

class NotFoundError(HTTPException):
    code = 404
    message = "unknown not found error"
>>>>>>> ready to demo
