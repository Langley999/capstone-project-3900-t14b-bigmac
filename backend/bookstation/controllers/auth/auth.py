from json import dumps
import time
from bookstation import app, request, db, error
from bookstation.models.user_sys import User
from flask import session
from config import SECRET
import hashlib
import jwt

url_prefix = "/auth"

@app.route(url_prefix + "/login", methods=["POST"])
def login():
    """
    Function for users to login. It will store new valid token to
    redis and session.

    Args (POST body):
        email (string): user email.
        password (string): raw password.

    Returns:
        token (string): the new valid token

    Raises:
        BadReqError: when body data is invalid 
        InputError:
            1. when user enters a unregistered email
            2. incorrect password
    
    TODO:
        modify error msg
    """
    # try read data
    try:
        data = request.get_json()
        email, password = data['email'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    # sql select user and check password
    user = User.query.filter_by(email = email).first()
    if user is None:
        raise error.InputError(description="not a valid user")
    if pw_encode(password) != user.password:
        raise error.InputError(description="wrong password")
    # generate token and store
    token = generate_token(user.username)
    session[email] = token
    return dumps({
        'token': token
    })

@app.route(url_prefix + "/register", methods=["POST"])
def register():
    """
    Function for users to register an account. It will store new valid token to
    redis and session. It will stored encoded passwords into database.

    Args (POST body):
        email (string): user email.
        password (string): raw password.
        username (string): username

    Returns:
        token (string): the new valid token

    Raises:
        BadReqError: when body data is invalid 
        InputError:
            1. when user enters a registerd email
            2. when user enters a registerd username
    
    TODO:
        modify error msg
    """
    # try read data
    try:
        data = request.get_json()
        username, email, password = data['username'], data['email'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    # check validity of email
    if User.query.filter_by(email = email).first() is not None:
        raise error.InputError(description="invalid email") 
    # check validity of username
    if User.query.filter_by(username = username).first() is not None:
        raise error.InputError(description="invalid username")
    # store new user
    new_user = User(username, email, pw_encode(password))
    db.session.add(new_user)
    db.session.commit()
    return dumps({
        'token': generate_token(username)
    })

@app.route(url_prefix + "/logout", methods=["POST"])
def logout():
    """
    Function for users to logout. It will clean the valid token.

    Args (POST body):
        email (string): user email
        token (string): valid token

    Returns:
        no returns

    Raises:
        BadReqError: when body data is invalid 
        InputError:
            1. when user enters an unregistered email
            2. incorrect password
    
    TODO:
        modify error msg
    """
    try:
        data = request.get_json()
        email, token = data['email'], data['token']
    except:
        raise error.BadReqError(description="post body error")
    try:
        stored_token = session.get(email)
    except:
        raise error.AccessError(description="user doesn't exist")
    if stored_token != token:
        raise error.AccessError(description="you logout invalid account")
    session.pop(email, None)
    return dumps({})

def pw_encode(password):
    '''
    It will encode raw password by sha256 from hashlib.

    Args:
        password (string): raw password

    Return:
        (string) encoded password
    '''
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(username):
    '''
    It will generate a new token by username and current time with SECRET.

    Args:
        username (string): username

    Return:
        (string) encoded token
    '''
    return jwt.encode({
            "username": username,
            "time": time.time()
        }, SECRET, algorithm='HS256').decode('utf-8')