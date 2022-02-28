from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from json import dumps

def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
CORS(app)
app.register_error_handler(Exception, defaultHandler)
# next line is for multi env
# app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

from bookstation import views
from bookstation import models
from bookstation import error
