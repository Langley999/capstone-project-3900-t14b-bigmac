from json import dumps
from backend.bookstation.models.book_sys import Collection_book
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection
from bookstation.utils.auth_util import login_status_check, pw_encode
from datetime import datetime

url_prefix = '/user'

@app.route(url_prefix + '/checkgoal', methods=["GET"])
def get_goal():
    '''
    It returns profile data of target user.

    Args (GET):
        operator (string): the requester's email
        token (string): valid token

    Returns:
        is_self (boolean): True if the user is requesting his own profile, else False
        username (string): target user's username
        email (string): target user's email

    Raises:
        AccessError: login check
        NotFoundError: when target email is an invalid email
    '''
    operator_email = request.args.get('operator')
    token = request.args.get('token')
    login_status_check(operator_email, token)

    # sql select user
    user = User.query.filter_by(email=operator_email).first()
    collection = Collection.query.filter_by(user_id = user.user_id, name = "Reading History").first()
    book_collections = Collection_book.query.filter_by(collection_id=collection.collection_id).all()

    month = datetime.date.today().month
    year = datetime.date.today().year

    book_done = 0
    for book_collection in book_collections:
        date = book_collection.created_time
        if date.month == month and date.year == year:
            book_done += 1
    
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "goal": 20,
        "finished": book_done,

    })

    
@app.route(url_prefix + '/setgoal', methods=["POST"])
def set_goal():
    '''
    It returns profile data of target user.

    Args (GET):
        operator (string): the requester's email
        target (string): target user's email
        token (string): valid token

    Returns:
        is_self (boolean): True if the user is requesting his own profile, else False
        username (string): target user's username
        email (string): target user's email
        TODO: add more returns and profile image

    Raises:
        AccessError: login check
        NotFoundError: when target email is an invalid email

    TODO:
        1. add returns
        2. find a way to prevent potential security issues
    '''
    operator_email = request.args.get('operator')
    target_email = request.args.get('target')
    token = request.args.get('token')
    login_status_check(operator_email, token)
    # sql select user
    user = User.query.filter_by(email=target_email).first()
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "is_self": True if (operator_email == target_email) else False,
        "username": user.username,
        "email": user.email
    })


@app.route(url_prefix + '/profile', methods=["GET"])
def get_user_profile():
    '''
    It returns profile data of target user.

    Args (GET):
        operator (string): the requester's email
        target (string): target user's email
        token (string): valid token

    Returns:
        is_self (boolean): True if the user is requesting his own profile, else False
        username (string): target user's username
        email (string): target user's email
        TODO: add more returns and profile image

    Raises:
        AccessError: login check
        NotFoundError: when target email is an invalid email

    TODO:
        1. add returns
        2. find a way to prevent potential security issues
    '''
    operator_email = request.args.get('operator')
    target_email = request.args.get('target')
    token = request.args.get('token')
    login_status_check(operator_email, token)
    # sql select user
    user = User.query.filter_by(email=target_email).first()
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "is_self": True if (operator_email == target_email) else False,
        "username": user.username,
        "email": user.email
    })


@app.route(url_prefix + '/profile', methods=["GET"])
def get_user_profile():
    '''
    It returns profile data of target user.

    Args (GET):
        operator (string): the requester's email
        target (string): target user's email
        token (string): valid token

    Returns:
        is_self (boolean): True if the user is requesting his own profile, else False
        username (string): target user's username
        email (string): target user's email
        TODO: add more returns and profile image

    Raises:
        AccessError: login check
        NotFoundError: when target email is an invalid email

    TODO:
        1. add returns
        2. find a way to prevent potential security issues
    '''
    operator_email = request.args.get('operator')
    target_email = request.args.get('target')
    token = request.args.get('token')
    login_status_check(operator_email, token)
    # sql select user
    user = User.query.filter_by(email=target_email).first()
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "is_self": True if (operator_email == target_email) else False,
        "username": user.username,
        "email": user.email
    })

@app.route(url_prefix + '/update', methods=["POST"])
def update_user_profile():
    '''
    It will update user's details like username, email.

    Args (POST):
        origin (string): the origin email
        token (string): valid token
        email (string): new email
        username (string): new username
        password (string): new raw password
        TODO: add more data

    Returns:
        no returns.

    Raises:
        AccessError: login check
        BadReqError: when post body is invalid
        InputError:
            1. new username has been registered
            2. new email has been registerd

    TODO:
        1. add more params
    '''
    try:
        data = request.get_json()
        origin_email, new_email, new_username, token, new_password = \
            data['origin'], data['email'], data['username'], data['token'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    login_status_check(origin_email, token)
    # sql select origin user
    user = User.query.filter_by(email=origin_email).first()
    if (user == None):
        raise error.BadReqError(description="post body error")
    # check if new_username is valid
    if (user.username != new_username):
        if (User.query.filter_by(username=new_username).first() != None):
            raise error.InputError(description="invalid username")
        user.username = new_username
    # check if new_email is valid
    if (origin_email != new_email):
        if (User.query.filter_by(email=new_email).first() != None):
            raise error.InputError(description="invalid email")
        user.email = new_email
    # change password
    user.password = pw_encode(new_password)
    db.session.add(user)
    db.session.commit()
    return dumps({})
    
# TODO
# need to decide how to do reading plan
