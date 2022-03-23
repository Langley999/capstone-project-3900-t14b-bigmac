from json import dumps
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, User, Post
from bookstation.utils.auth_util import get_user
from datetime import date, datetime
from sqlalchemy import desc

@app.route("/user/search", methods=["GET"])
def findUsers():
    print("reach search")
    token = request.args.get('token')
    search_prhase = request.args.get('search_phrase')
    user = get_user(token)
    users = User.query.filter(User.username.ilike('%'+ search_prhase +'%'))
    userf_list = []
    for userf in users:
        if userf.user_id == user.user_id:
            continue
        userf_dict = {'user_id' : userf.user_id, 'username' : userf.username, 'avatar' : userf.avatar}
        if Follow_relationship.query.filter_by(user_id = userf.user_id ,follower_user_id = user.user_id).first() != None:
            userf_dict['isFollowing'] = True
        else:
            userf_dict['isFollowing'] = False
        userf_list.append(userf_dict)

    userf_list.sort(key = lambda x: x['username'])

    return dumps({ 'users' : userf_list})


@app.route("/user/follow", methods=["POST"])
def follow():

    body = request.get_json()
    token = body.get('token')
    target_user_id = body.get('user_id')
    user = get_user(token)

    if User.query.get(target_user_id) == None:
        raise error.NotFoundError(description='Target user not found')

    if Follow_relationship.query.filter_by(user_id = target_user_id ,follower_user_id = user.user_id).first() != None:
        raise error.BadReqError(description= 'User is already following target user')
    following_entry = Follow_relationship(follower_user_id=user.user_id, user_id=target_user_id, created_time = datetime.now())
    db.session.add(following_entry)
    db.session.commit()

    return dumps({})

@app.route("/user/unfollow", methods=["POST"])
def unfollow():

    body = request.get_json()
    token = body.get('token')
    target_user_id = body.get('user_id')
    user = get_user(token)

    if User.query.get(target_user_id) == None:
        raise error.NotFoundError(description='Target user not found')

    following_entry = Follow_relationship.query.filter_by(user_id = target_user_id ,follower_user_id = user.user_id).first()
    if following_entry == None:
        raise error.BadReqError(description= 'User doesnt follow target user')

    db.session.delete(following_entry)
    db.session.commit()

    return dumps({})


@app.route("/user/followstats", methods=["GET"])
def followStats():
    """
    Returns: followers and followings gained each month over past 6 months

    """
    token = request.args.get('token')
    user = get_user(token)
    curr_month = datetime.now().month
    curr_year = datetime.now().year
    init_month = curr_month - 5
    init_year = curr_year
    if init_month < 1:
        init_month = 12 + init_month
        init_year = curr_year - 1
    stats = []
    for x in range(0, 6):
        if init_month > 12:
            init_month = 1
            init_year += 1

        month_dict = {'month' : init_month, 'followings' : 0, 'followers' : 0}
        followings = Follow_relationship.query.filter_by(follower_user_id = user.user_id)
        followers = Follow_relationship.query.filter_by(user_id = user.user_id)
        for following in followings:
            if following.created_time.month == init_month and following.created_time.year == init_year:
                month_dict['followings'] += 1

        for follower in followers:
            if follower.created_time.month == init_month and follower.created_time.year == init_year:
                month_dict['followers'] += 1
        init_month += 1
        stats.append(month_dict)

    return dumps({'follow_stats' : stats})

@app.route("/post/addpost", methods=["POST"])
def addPost():

    body = request.get_json()
    token = body.get('token')
    new_content = body.get('content')
    user = get_user(token)

    newPost = Post(user_id=user.user_id, content= new_content, created_time= datetime.now())
    db.session.add(newPost)
    db.session.commit()

    return dumps({})


@app.route("/post/getposts", methods=["GET"])
def getPosts():

    token = request.args.get('token')
    user = get_user(token)

    posts = Post.query.filter_by(user_id = user.user_id).all()
    posts_list = []
    for post in posts:
        post_dict = {'post_id': post.post_id, 'content': post.content, 'time_created': str(post.created_time)}
        posts_list.append(post_dict)

    posts_list.sort(key = lambda x: x['time_created'], reverse=True)
    return dumps({'posts' : posts_list})


@app.route("/post/getfeed", methods=["GET"])
def getFeed():

    token = request.args.get('token')
    user = get_user(token)
    followed_users = Follow_relationship.query.filter_by(follower_user_id = user.user_id).all()
    posts_list = []
    for followed_user in followed_users:
        posts = Post.query.filter_by(user_id = followed_user.user_id).all()
        for post in posts:
            post_dict = {'user_id': post.user.user_id, 'username': post.user.username , 'avatar' : post.user.avatar, 'post_id': post.post_id, 'content': post.content, 'time_created': str(post.created_time)}
            posts_list.append(post_dict)

    posts_list.sort(key = lambda x: x['time_created'], reverse=True)
    return dumps({'posts' : posts_list})



# please fix this function so that it only requests token as we dicussed in meeting
# lines 136-140 should simply be replaced with user = get_user(token) (from auth.utils)
# only token should be given NOT user_id
# I won't change it because I'm not sure if frontend is using this, so I dont want to break it
# so when you change it please make sure frontend also updates to give token
# remmeber for all future functions to never ask for user_id, or anything related to user
# you should ONLY be asking for token and then get what you need from the user object obtained
# after calling get_user(token)
@app.route("/user/getfollowing", methods=["GET"])
def getfollowing():
    """
    Function for user to to get all user he's following
    Args:
        user_id (int): id of the user
    Returns:
        - followings (list):
            - user_id (int)
            - username (str)
    Raises:
        NotFoundError: when the book does not exist in the collection
        AccessError:
          - when the user does not have permission to remove book
        BadReqError:
          - when removing book fails
    """
    user_id = request.args.get('user_id')

    if User.query.get(user_id) == None:
        raise error.NotFoundError(description='Target user not found')

    followings = Follow_relationship.query.filter_by(follower_user_id = user_id).all()
    result = []
    for following in followings:
        userinfo = {}
        user = User.query.get(following.user_id)
        userinfo['user_id'] = following.user_id
        userinfo['username'] = user.username
        result.append(userinfo)

    return dumps({
        "followings": result
    })


#SAME THING HERE!
@app.route("/user/getfollower", methods=["GET"])
def getfollower():
    """
    Function for user to to get all followers
    Args:
        user_id (int): id of the user
    Returns:
        - followers (list):
            - user_id (int)
            - username (str)
    Raises:
        NotFoundError: when the book does not exist in the collection
        AccessError:
          - when the user does not have permission to remove book
        BadReqError:
          - when removing book fails
    """
    user_id = request.args.get('user_id')

    if User.query.get(user_id) == None:
        raise error.NotFoundError(description='Target user not found')

    followings = Follow_relationship.query.filter_by(user_id = user_id).all()
    result = []
    for following in followings:
        userinfo = {}
        user = User.query.get(following.follower_user_id)
        userinfo['user_id'] = following.follower_user_id
        userinfo['username'] = user.username
        result.append(userinfo)

    return dumps({
        "followers": result
    })


@app.route("/post/getpublicfeed", methods=["GET"])
def getPublicFeed():

    posts_list = []

    posts = Post.query.order_by(desc(Post.created_time)).all()
    for post in posts:
        post_dict = {'user_id': post.user.user_id, 'username': post.user.username , 'avatar' : post.user.avatar, 'post_id': post.post_id, 'content': post.content, 'time_created': str(post.created_time)}
        posts_list.append(post_dict)

    return dumps({'posts' : posts_list[:20]})