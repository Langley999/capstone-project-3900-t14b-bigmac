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


"""
Helper method to create a hash digest of password
"""
def pw_encode(password):

    return hashlib.sha256(password.encode()).hexdigest()

"""
Helper method to create hash of username and time.
Time inclusion ensures freshness of tokens
"""
def generate_token(username):
    hash_string = username + time.time().hex()
    return hashlib.sha256(hash_string.encode()).hexdigest() 
