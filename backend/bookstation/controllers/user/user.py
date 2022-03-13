from json import dumps
from bookstation.models.book_sys import Collection_book
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection, Goal
from bookstation.utils.auth_util import login_status_check, pw_encode
from datetime import datetime,date

url_prefix = '/user'


@app.route(url_prefix + '/checkgoal', methods=["GET"])
def get_goal():
    '''
    It returns the goal of current month and current progress: if the goal is not set, - 1 will be returned
    Args (GET):
        operator (string): the requester's email
        token (string): valid token
    Returns:
        goal (int): -1 if the user hasn't set a goal for this month
        finished (int): the number of books finished in this month
    Raises:
        AccessError: login check
        NotFoundError: when the user is not found
    '''
    operator_email = request.args.get('operator')
    token = request.args.get('token')
#     login_status_check(operator_email, token)

    # sql select user
    user = User.query.filter_by(email=operator_email).first()
    collection = Collection.query.filter_by(user_id = user.user_id, name = "Reading History").first()
    book_collections = Collection_book.query.filter_by(collection_id=collection.collection_id).all()

    month = datetime.date.today().month
    year = datetime.date.today().year
    curr_goal = -1
    goals = Goal.query.filter_by(user_id=user.user_id).all()
    for goal in goals:
        if goal.created_date.year == year and goal.created_date.month == month:
            curr_goal = goal.books_set
    book_done = 0
    for book_collection in book_collections:
        date = book_collection.created_time
        if date.month == month and date.year == year:
            book_done += 1

    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "goal": curr_goal,
        "finished": book_done,

    })


@app.route(url_prefix + '/setgoal', methods=["POST"])
def set_goal():
    '''
    It sets the goal of this user for this month
    Args (GET):
        email (string): the requester's email
        token (string): valid token
        goal (int): the goal of user for this month
    Returns:
        "success"
    Raises:
        AccessError: login check
        NotFoundError: when the user is not found
    '''
    try:
        data = request.get_json()
        email, goal, token = data['email'], data['goal'], data['token']
    except:
        raise error.BadReqError(description="post body error")
#     login_status_check(email, token)
    # sql select user
    user = User.query.filter_by(email=email).first()
    if (user == None):
        raise error.NotFoundError(description="cannot find user")


    today = date.today()
    new_goal = Goal(user.user_id, today, goal, 0)
    db.session.add(new_goal)
    db.session.commit()

    year = today.year
    month = today.month-1
    if month == 0:
      month = 12
      year = year-1
    prev_goal = None
    goals = Goal.query.filter_by(user_id=user.user_id).all()
    for goal in goals:
        if goal.created_date.year == year and goal.created_date.month == month:
            prev_goal = goal

    collection = Collection.query.filter_by(user_id = user.user_id, name = "Reading History").first()
    book_collections = Collection_book.query.filter_by(collection_id=collection.collection_id).all()
    book_done = 0
    for book_collection in book_collections:
        date = book_collection.created_time
        if date.month == month and date.year == year:
            book_done += 1
    prev_goal.books_completed = book_done
    db.session.add(prev_goal)
    db.session.commit()

    return dumps({
        "succuss":[]
    })


@app.route(url_prefix + '/getallgoal', methods=["GET"])
def get_all_goal():
    '''
    It gets goal histories of a user
    Args (GET):
        email (string): the requester's email
        token (string): valid token
        goal (int): the goal of user for this month
    Returns:
        "goal_history" (list):
            - created_time (date): created date of the goal (frontend will only display year and month, day is irrelevant)
            - goal (int): goal of this user for that month
            - books_completed (int): number of books user completed during that month
    Raises:
        AccessError: login check
        NotFoundError: when the user is not found
    '''
    operator_email = request.args.get('operator')
    token = request.args.get('token')
#     login_status_check(operator_email, token)

    # sql select user
    user = User.query.filter_by(email=operator_email).first()
    all_history = []
    goals = Goal.query.filter_by(user_id=user.user_id).all()
    for goal in goals:
        history = {}
        history['created_time'] = goal.created_time
        history['goal'] = goal.books_set
        history['books_completed'] = goal.books_completed
        all_history.append(history)
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "goal_history": all_history,
    })




@app.route(url_prefix + '/profile', methods=["GET"])
def get_user_profile():
    '''
    It returns profile data of target user.
    Args (GET):
        operator (string): the requester's email
        username (string): target user's username
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
    username = request.args.get('username')
    token = request.args.get('token')
#     login_status_check(operator_email, token)
    # sql select user
    user = User.query.filter_by(username=username).first()
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "is_self": True if (user.username == username) else False,
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
#     login_status_check(origin_email, token)
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