from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
from json import dumps
#import redis

admintoken = {}

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

code = {}
app = Flask(__name__)
#app.secret_key = 'BIGMAC'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookstation.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'BIGMAC'
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='bigmaccomp3900@gmail.com',
    MAIL_PASSWORD='BigMaccomp3900'
)
CORS(app)
Session(app)
app.register_error_handler(Exception, defaultHandler)

db = SQLAlchemy(app)


from bookstation import controllers
from bookstation import models
from bookstation import error