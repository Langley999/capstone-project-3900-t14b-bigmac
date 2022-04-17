from json import dumps
from bookstation.models.event_sys import User_badge
from bookstation.models.event_sys import Badge,Quiz
from bookstation.models.book_sys import Collection_book
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, User, Collection, Goal
from bookstation.utils.auth_util import pw_encode
from datetime import datetime
from bookstation.utils.auth_util import get_user
import datetime

url_prefix = '/user'

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
@app.route(url_prefix + '/checkgoal', methods=["GET"])
def get_goal():
    token = request.args.get('token')
    user = get_user(token)
    collection = Collection.query.filter_by(user_id = user.user_id, name = "Reading History").first()
    if collection == None:
        return dumps({
            "goal": -1,
            "finished": 0,
        })
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
@app.route(url_prefix + '/setgoal', methods=["POST"])
def set_goal():

    try:
        data = request.get_json()
        goal, token = data['goal'], data['token']
    except:
        raise error.BadReqError(description="post body error")
    user = get_user(token)
    if (user == None):
        raise error.NotFoundError(description="cannot find user")

    today = datetime.date.today()
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
    if prev_goal != None:
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

'''
It gets goal histories of a user
Args (GET):
    token (string): valid token
Returns:
    "goal_history" (list):
        - created_time (date): created date of the goal (frontend will only display year and month, day is irrelevant)
        - goal (int): goal of this user for that month
        - books_completed (int): number of books user completed during that month
Raises:
    AccessError: login check
    NotFoundError: when the user is not found
'''
@app.route(url_prefix + '/getallgoal', methods=["GET"])
def get_all_goal():

    token = request.args.get('token')
    user = get_user(token)
    all_history = []
    goals = Goal.query.filter_by(user_id=user.user_id).all()
    for goal in goals:
        history = {}
        history['created_time'] = str(goal.created_date)
        history['goal'] = goal.books_set
        history['books_completed'] = goal.books_completed
        all_history.append(history)
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    return dumps({
        "goal_history": all_history,
    })



'''
It returns profile data of target user.
Args (GET):

    user_id (string): target user's id
    token (string): valid token
Returns:
    is_self (boolean): True if the user is requesting his own profile, else False
    username (string): target user's username
    email (string): target user's email
    avatar (string base64): user's avatar
Raises:
    AccessError: login check
    NotFoundError: when target email is an invalid email
'''
@app.route(url_prefix + '/profile', methods=["GET"])
def get_user_profile():

    user_id = int(request.args.get('user_id'))
    token = request.args.get('token')
    operator = get_user(token)
    user = User.query.get(user_id)
    if (user == None):
        raise error.NotFoundError(description="cannot find user")
    isFollowing = False
    if Follow_relationship.query.filter_by(follower_user_id = operator.user_id, user_id = user_id).first() != None:
        isFollowing = True

    badges = User_badge.query.filter_by(user_id=user_id).all()
    badgelist = []
    for badge in badges:
        quiz = Quiz.query.filter_by(badge_id=badge.badge_id).first()
        if quiz != None:
            badgeobj = {
                'badge_id': badge.badge_id,
                'badge_image': Badge.query.get(badge.badge_id).image,
                'quiz_id': quiz.quiz_id,
                'quiz_name': quiz.quiz_name,
                'quiz_description': quiz.description
            }
            badgelist.append(badgeobj)
    return dumps({
        "is_self": True if (operator.user_id == user_id) else False,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar,
        "isFollowing" : isFollowing,
        "badges": badgelist

    })

'''
It will update user's details like username
Args (POST):
    origin (string): the origin email
    token (string): valid token
    username (string): new username
    password (string): new raw password
Returns:
    no returns.
Raises:
    AccessError: login check
    BadReqError: when post body is invalid
    InputError:
        1. new username has been registered
        2. new email has been registerd
'''
@app.route(url_prefix + '/update', methods=["POST"])
def update_user_profile():

    try:
        data = request.get_json()
        new_username, token, new_password = data['username'], data['token'], data['password']
    except:
        raise error.BadReqError(description="post body error")
    user = get_user(token)
    if (user == None):
        raise error.BadReqError(description="post body error")
    # check if new_username is valid
    if (user.username != new_username):
        if (User.query.filter_by(username=new_username).first() != None):
            raise error.InputError(description="invalid username")
        user.username = new_username
    # change password
    user.password = pw_encode(new_password)
    db.session.add(user)
    db.session.commit()
    return dumps({})

'''
It will update user's avatar.
Args (POST):
    token (string): valid token
    avatar (base64 string): avatar image of base64 format
Returns:
    no returns.
Raises:
    AccessError: login check
    BadReqError: when post body is invalid
    InputError:
        1. new username has been registered
        2. new email has been registerd
'''
@app.route(url_prefix + '/updateavatar', methods=["POST"])
def update_user_avatar():

    try:
        data = request.get_json()
        avatar, token = \
            data['avatar'], data['token']
    except:
        raise error.BadReqError(description="post body error")
    user = get_user(token)
    if (user == None):
        raise error.BadReqError(description="post body error")
    # change password
    user.avatar = avatar
    db.session.add(user)
    db.session.commit()
    return dumps({})