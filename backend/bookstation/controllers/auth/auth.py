from json import dumps
import time
from bookstation import app, request, db, error, code
from bookstation.utils.auth_util import get_user, pw_encode, generate_token
from flask_mail import Mail, Message
from bookstation.models.user_sys import *
from bookstation.models.book_sys import *
from datetime import datetime
from random import randint

from flask import session
#from config import SECRET
import hashlib
import jwt


url_prefix = "/auth"

@app.route(url_prefix, methods=["POST"])
def test():
    user = User.query.filter_by(user_id=4).first()
    for r in user.collections:
        print(r.name)
    '''test1'''
    # collection = Collection(name="test")
    # collection.user_id = 4
    # collection.created_time = '2022-03-09 22:10:57'
    # db.session.add(collection)
    # db.session.commit()
    # for r in user.collections:
    #     print(r.name)
    '''test2'''
    # collection = user.collections[-1]
    # print(collection.name)
    # print(collection.books)
    # collection_book = Collection_book()
    # collection_book.book_id = 12
    # collection_book.collection_id = collection.collection_id
    # collection_book.created_time = '2022-03-09 22:10:57'
    # db.session.add(collection_book)
    # db.session.commit()
    # for book in collection.books:
    #     print(book.title)
    return dumps({})

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
    user.token = token
    print('user is', user.user_id)
    print('token is', user.token)
    #db.session.add(user)
    db.session.commit()
    #session[token] = user.user_id
    #session[email] = token

    return dumps({
        'token': token,
        'username': user.username,
        'user_id': user.user_id

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
        raise error.InputError(description="email already exists")
    # check validity of username
    if User.query.filter_by(username = username).first() is not None:
        raise error.InputError(description="username already exists")
    # store new user


    return dumps({
        'valid_user' : True
    })

@app.route(url_prefix + "/sendCode", methods=["POST"])
def sendCode():
    body = request.get_json()
    email = body['email']
    mail = Mail(app)
    try:
        msg = Message("Verification Code: ", sender= 'bigmaccomp3900@gmail.com', recipients=[email])
        code[email] = randint(10000, 99999)
        msg.body = f"Your reset code is {str(code)}"
        mail.send(msg)
    except:
        raise error.NotFoundError(description="Email not found")

    return dumps({
        'sent_email' : True
    })



@app.route(url_prefix + "/verified", methods=["POST"])
def verify():
    data = request.get_json()
    username, email, password, user_code = data['username'], data['email'], data['password'], data['user_code']
    print('stored code is: ', code)
    if code[email] != user_code:
        raise error.InputError(description="Verification code does not match")
    code.pop(email, None)
    token = generate_token(username)
    new_user = User(username, email, pw_encode(password), token, None)

    db.session.add(new_user)
    db.session.commit()
    db.session.flush()
    new_default_collection = Collection(1, "Favourite", datetime.now(), new_user.user_id)
    new_history_collection = Collection(2, "Reading History", datetime.now(), new_user.user_id)
    db.session.add(new_default_collection)
    db.session.add(new_history_collection)
    db.session.commit()
    return dumps({
        'token': token,
        'user_id': new_user.user_id
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
        token = data['token']
    except:
        raise error.BadReqError(description="post body error")
    try:
        user = User.query.filter_by(token=token).first()
        user.token = None
        db.session.commit()
    except:
        raise error.AccessError(description="user doesn't exist or invalid token")

    #session.pop(token, None)
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
        }, 'BIGMAC', algorithm='HS256').decode('utf-8')
