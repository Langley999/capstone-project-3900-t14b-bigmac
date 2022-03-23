import time
import hashlib
import jwt
SECRET = "BIGMAC"
from bookstation import error
from bookstation.models.user_sys import User
from flask import session


def get_user(token):
    user = User.query.filter_by(token = token).first()
    if user == None:
        raise error.NotFoundError(description = 'Invalid or expired token, cannot find user')
    return user


def login_status_check(email, token):
    '''
    It check wheter this user has logined or not
    Args:
        email (string): user email
        token (string): user token
    Return:
        no returns
    Raises:
        AccessError:
            1. incorrect token
            2. cannot get token
    
    TODO:
        make this function into decorator
    '''
    try:
        stored_token = session.get(email)
        if (stored_token != token):
            raise error.AccessError(description="you need to login first")
    except:
        raise error.AccessError(description="you have to login first")

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
