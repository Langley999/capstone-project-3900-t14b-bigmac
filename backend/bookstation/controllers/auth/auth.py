from json import dumps
import re
import time
from bookstation import app, request, db, error
from bookstation.models.User import User
from config import SECRET
import hashlib
import jwt

url_prefix = "/auth"

@app.route(url_prefix + "/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email, password = data['email'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    user = User.query.filter_by(email = email).first()
    if user is None:
        raise error.InputError(description="not a valid user")
    if pw_encode(password) != user.password:
        raise error.InputError(description="wrong password")
    token = generate_token(user.username)
    user.token = token
    db.session.commit()
    return dumps({
        'token': token
    })

@app.route(url_prefix + "/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username, email, password = data['username'], data['email'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    if User.query.filter_by(email = email).first() is not None:
        raise error.InputError(description="invalid email") 
    if User.query.filter_by(username = username).first() is not None:
        raise error.InputError(description="invalid username")
    new_user = User(username, email, pw_encode(password), generate_token(username))
    db.session.add(new_user)
    db.session.commit()
    return dumps({
        'token': new_user.token
    })

@app.route(url_prefix + "/logout", methods=["POST"])
def logout():
    try:
        data = request.get_json()
        email, token = data['email'], data['token']
    except:
        raise error.BadReqError(description="post body error")
    user = User.query.filter_by(email = email).first()
    if user is None:
        raise error.AccessError(description="permission deny")
    if user.token != token:
        raise error.AccessError(description="permission deny")
    user.token = None
    db.session.commit()
    return dumps({})

def pw_encode(password):
    '''
    this is for password encoding by sha256 from hashlib.

    Args:
        param1: entered password

    Return:
        encoded password
    '''
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(username):
    return jwt.encode({
            "username": username,
            "time": time.time()
        }, SECRET, algorithm='HS256').decode('utf-8')
