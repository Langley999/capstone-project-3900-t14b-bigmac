from json import dumps
import time
from bookstation import app, request, db, error, code
from bookstation.utils.auth_util import get_user, pw_encode, generate_token
from flask_mail import Mail, Message
from bookstation.models.user_sys import *
from bookstation.models.book_sys import *
from datetime import datetime
from random import randint
from bookstation.models.user_sys import Notification_history

from flask import session
#from config import SECRET
import hashlib
import jwt


url_prefix = "/auth"


"""
Log the requested user into the system
Args:
    email (string): email address of the user
	password (string): asscociated password of the user

Returns:
    (dict): Dictionary containing user related information
        - token (string): token to be used for user session validation
        - username (string): username of the logged user
		- user_id (integer): user_id of the logged user
Raises:
    NotFoundError: no user associated with email
    InputError: incorrect password for user
"""
@app.route(url_prefix + "/login", methods=["POST"])
def login():

    data = request.get_json()
    email, password = data['email'], data['password']

    user = User.query.filter_by(email = email).first()
    if user is None:
        raise error.NotFoundError(description="not a valid user")
    if pw_encode(password) != user.password:
        raise error.InputError(description="wrong password")

    token = generate_token(user.username)
    user.token = token
    db.session.commit()

    return dumps({
        'token': token,
        'username': user.username,
        'user_id': user.user_id

    })


"""
Check for registration capability for the requested user
Args:
    username (string): username of the user
    email (string): email address of the user
	password (string): asscociated password of the user

Returns:
    valid_user: Confirmation of user validity 

Raises:
    InputError: Email invalid already exists in the system
    InputError: Username invalid already exists in the system
"""
@app.route(url_prefix + "/register", methods=["POST"])
def register():

    data = request.get_json()
    username, email, password = data['username'], data['email'], data['password']

    if User.query.filter_by(email = email).first() is not None:
        raise error.InputError(description="email already exists")

    if User.query.filter_by(username = username).first() is not None:
        raise error.InputError(description="username already exists")

    return dumps({
        'valid_user' : True
    })


"""
Send validation code to verify potential user
Args:
    email (string): email address of the user

Returns:
    sent_email: Confirmation of sending to email

Raises:
    NotFoundError: Failed to send email to requested address
"""
@app.route(url_prefix + "/sendCode", methods=["POST"])
def sendCode():
    body = request.get_json()
    email = body['email']
    mail = Mail(app)
    try:
        msg = Message("Verification Code: ", sender= 'bigmaccomp3900@gmail.com', recipients=[email])
        code[email] = randint(10000, 99999)
        msg.body = f"Your verification code for BookStation is {str(code[email])}"
        mail.send(msg)
        print('VERIFICATION CODE:', code[email])
    except:
        raise error.NotFoundError(description="Email not found")

    return dumps({
        'sent_email' : True
    })


"""
Intiate a verification request for user
Args:
    username (string): username of the user
    email (string): email address of the user
	password (string): asscociated password of the user

Returns:
    token (string): token to be used for user session validation
    user_id (string): user_id of newly registered user

Raises:
    InputError: Invalid code, does not match server's buffered one.
"""
@app.route(url_prefix + "/verified", methods=["POST"])
def verify():
    data = request.get_json()
    username, email, password, user_code = data['username'], data['email'], data['password'], data['user_code']
    email = str(email)
    if int(code[email]) != int(user_code):
        print('comparison failed', code)
        raise error.InputError(description="Verification code does not match")
    code.pop(email, None)
    token = generate_token(username)
    new_user = User(username, email, pw_encode(password), token, None)

    db.session.add(new_user)
    db.session.commit()
    new_default_collection = Collection(1, "Favourite", datetime.now(), new_user.user_id)
    new_history_collection = Collection(2, "Reading History", datetime.now(), new_user.user_id)
    db.session.add(new_default_collection)
    db.session.add(new_history_collection)

    newhistory = Notification_history(user_id=new_user.user_id,last_read=0)
    db.session.add(newhistory)

    db.session.commit()
    return dumps({
        'token': token,
        'user_id': new_user.user_id
    })



"""
Logs the current user out of the system
Args:
    token (string): token used to identify and validate user session
Raises:
    AccessErorr: Token is invalid or expired from the system
"""
@app.route(url_prefix + "/logout", methods=["POST"])
def logout():
    data = request.get_json()
    token = data['token']

    try:
        user = User.query.filter_by(token=token).first()
        user.token = None
        db.session.commit()
    except:
        raise error.NotFoundError(description="user doesn't exist or invalid token")

    return dumps({})

