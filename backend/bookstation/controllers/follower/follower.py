from json import dumps
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, Notification, User, Post
from bookstation.utils.auth_util import get_user
from datetime import date, datetime
from sqlalchemy import desc


@app.route("/user/notifications", methods=["GET"])
def getNotifications():
    token = request.args.get('token')
    user = get_user(token)
    following_users = Follow_relationship.query.filter_by(follower_user_id = user.user_id).all()
    all_notifications = []
    for fuser in following_users:
        notifications = Notification.query.filter_by(user_id = fuser.user_id).all()
        for notification in notifications:
            all_notifications.append({'type' : notification.type, 'type_id': notification.type_id, 'time' : notification.time})

    all_notifications.sort(key = lambda x: x['time'], reverse=True)
    return dumps({'notifications' : all_notifications})



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
    newNotif = Notification(user_id=user.user_id, type='follow', type_id= None, time= datetime.now())
    db.session.add(newNotif)
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



@app.route("/post/addpost", methods=["POST"])
def addPost():

    body = request.get_json()
    token = body.get('token')
    new_content = body.get('content')
    user = get_user(token)

    newPost = Post(user_id=user.user_id, content= new_content, created_time= datetime.now())
    db.session.add(newPost)
    db.session.commit()
    newNotif = Notification(user_id=user.user_id, type='post', type_id=newPost.post_id, time= datetime.now())
    db.session.add(newNotif)
    db.session.commit()
    return dumps({
        "post_id": newPost.post_id
    })


@app.route("/post/removepost", methods=["POST"])
def removePost():

    body = request.get_json()
    token, post_id = body['token'], body['post_id']
    user = get_user(token)

    post = Post.query.filter_by(post_id = post_id).first()

    if post == None:
        raise error.NotFoundError(description="Post does not exist")
    if post.user_id != user.user_id:
        raise error.AccessError(description="You don't have permission to remove this post")

    try:
        db.session.delete(post)
        db.session.commit()

        return dumps({
            "success": []
        })
    except:
        raise error.BadReqError(description="Cannot remove post")


@app.route("/post/getposts", methods=["GET"])
def getPosts():

    token = request.args.get('token')
    user_id = request.args.get('user_id')
    #page_no = int(request.args.get('page'))
    user = get_user(token)
    posts = Post.query.filter_by(user_id = user_id).all()
    posts_list = []
    for post in posts:
        post_dict = {'post_id': post.post_id, 'content': post.content, 'time_created': str(post.created_time)}
        posts_list.append(post_dict)

    posts_list.sort(key = lambda x: x['time_created'], reverse=True)
    #posts_list = posts_list[10*(page_no-1): 10*page_no]
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
    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)
    followings = Follow_relationship.query.filter_by(follower_user_id = user_id).all()
    result = []
    for following in followings:
        userinfo = {}
        user = User.query.get(following.user_id) 
        userinfo['user_id'] = following.user_id
        userinfo['username'] = user.username
        userinfo['avatar'] = user.avatar
        result.append(userinfo)
        
    result.sort(key = lambda x: x['username'])
    return dumps({
        "followings": result
    })


#SAME THING HERE!
@app.route("/user/getfollower", methods=["GET"])
def getfollower():
    """
    Function for user to to get all followers
    Args:
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
    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)

    followings = Follow_relationship.query.filter_by(user_id = user_id).all()
    result = []
    for following in followings:
        userinfo = {}
        user = User.query.get(following.follower_user_id) 
        userinfo['user_id'] = following.follower_user_id
        userinfo['username'] = user.username
        userinfo['avatar'] = user.avatar
        result.append(userinfo)

    result.sort(key = lambda x: x['username'])
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

    return dumps({'posts' : posts_list})