from json import dumps
from bookstation.models.user_sys import Notification
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, User, Post
from bookstation.utils.auth_util import get_user
from datetime import date, datetime
from sqlalchemy import desc

"""
Description: 
- Searches for a users in the system based on some key phrase

Args:
- token String: to be used for session validation
- search_phrase String: phrase for pattern matching

Return:
- userf_list List: List of users in the sytem, augmented to include following status.

"""
@app.route("/user/search", methods=["GET"])
def findUsers():

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



"""
Establish a following relationship between the current user and a target user

Args:
    token (string): to be used for session validation
    target_user_id (integer): user id of the requested user to be unfollowed

Raises:
    NotFoundError: When the target user to be followed does not exist
    BadReqError: When the user already follows the target user

"""
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

    newnotif = Notification(user_id=target_user_id, type='follow', type_id = -1, time= datetime.now(), sender_id=user.user_id)
    db.session.add(following_entry)
    db.session.add(newnotif)
    db.session.commit()

    return dumps({})




"""
Delete a following relationship between the current user and a target user

Args:
    token (string): to be used for session validation
    target_user_id (integer): user id of the requested user to be unfollowed

Raises:
    NotFoundError: When the target user to be unfollowed does not exist
    BadReqError: When the user doesn't follow the target user

"""
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



"""
Description: 
    - Create a new comment post for the current user
    - Sends notification to all followers

Args:
    token (string): to be used for session validation
    content (string): information to be posted

Return: post_id (integer): Id of the newly created post after commiting to database

"""
@app.route("/post/addpost", methods=["POST"])
def addPost():

    body = request.get_json()
    token = body.get('token')
    new_content = body.get('content')
    user = get_user(token)

    newPost = Post(user_id=user.user_id, content= new_content, created_time= datetime.now())
    
    followers = Follow_relationship.query.filter_by(user_id = user.user_id).all()
    for follower in followers:
        newnotif = Notification(user_id=follower.follower_user_id, type='post', type_id = -1, time= datetime.now(), sender_id=user.user_id)
        db.session.add(newnotif)
        db.session.commit()
    db.session.add(newPost)
    db.session.commit()

    return dumps({
        "post_id": newPost.post_id
    })


"""
Description: 
    - Remove comment post for the current user
    - Checks whether post exists and throws error accordingly
    - Checks whether current user is the owner of the post, throws error accordingly

Args:
    token (string): to be used for session validation
    post_id (integer): token of the post being requested for removal

Return:
    sucess: confirmation of susscessful post removal

Raises:
    NotFoundError: Post does not exist
    BadReqError: Post cannot be deleted from the databse
    AccessError: Post is not owned by the current user

"""
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


"""
Description: 
- Retrieves all posts created from a specified user_id

Args:
    token (string): to be used for session validation
    user_id (integer): id of user for which posts would like to be viewed

Return:
    posts (list): List of post objects 
        - post_id (integer): id of post
        - content (string): content of post
        - time_created (datetime): time of post creation

"""
@app.route("/post/getposts", methods=["GET"])
def getPosts():

    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)

    posts = Post.query.filter_by(user_id = user_id).all()
    posts_list = []
    for post in posts:
        post_dict = {
            'post_id': post.post_id, 
            'content': post.content, 
            'time_created': str(post.created_time)}
        posts_list.append(post_dict)

    posts_list.sort(key = lambda x: x['time_created'], reverse=True)
    return dumps({'posts' : posts_list})



"""
Description: 
    - Retrieves personal feed for the current user
    - onsists of all the posts from users which the current user follows

Args:
    token (string): to be used for session validation

Return:
    posts (list): List of post objects sorted by time most recently
        - post_id (integer): id of post
        - content (string): content of post
        - time_created (datetime): time of post creation
        - user_id (integer): id of the user whom created the post
        - username (string):  username of the user whom created the post
        - avatar (string): avatr of the user whom created the post
"""
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




"""
Description: 
    - Retrieves list of followings for a specified user

Args:
    token (string): to be used for session validation
    user_id (integer): id of user for which we want to find followings for

Return:
    followings (list): List of user objects with only relevant information 
        - user_id (integer): user id of the following user
        - username (string): username of the following suer
        - avatar (string): avatr of the following user
"""
@app.route("/user/getfollowing", methods=["GET"])
def getfollowing():

    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)
    followings = Follow_relationship.query.filter_by(follower_user_id = user_id).all()
    result = []
    for following in followings:
        user = User.query.get(following.user_id) 
        userinfo = {
            'user_id': following.user_id,
            'username': user.username,
            'avatar': user.avatar
        }
        result.append(userinfo)
        
    result.sort(key = lambda x: x['username'])
    return dumps({
        "followings": result
    })


"""
Description: 
    - Retrieves list of followers for a specified user

Args:
    token (string): to be used for session validation
    user_id (integer): id of user for which we want to find followers for

Return:
    followers (list): List of user objects with only relevant information 
        - user_id (integer): user id of the follower user
        - username (string): username of the follower suer
        - avatar (string): avatr of the follower user
"""
@app.route("/user/getfollower", methods=["GET"])
def getfollower():

    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)

    followings = Follow_relationship.query.filter_by(user_id = user_id).all()
    result = []
    for following in followings:  
        user = User.query.get(following.follower_user_id) 
        userinfo = {
            'user_id': following.follower_user_id,
            'username': user.username,
            'avatar': user.avatar
        }
        result.append(userinfo)

    result.sort(key = lambda x: x['username'])
    return dumps({
        "followers": result
    })


"""
Description: 
    - Retrieves public post feed that is not user specific

Return:
    posts (list)): List of post objects corresponding to public feed
        - post_id (integer): id of post
        - content (string): content of post
        - time_created (datetime): time of post creation
        - user_id (integer): id of the user whom created the post
        - username (string):  username of the user whom created the post
        - avatar (string): avatr of the user whom created the post

"""
@app.route("/post/getpublicfeed", methods=["GET"])
def getPublicFeed():

    posts_list = []

    posts = Post.query.order_by(desc(Post.created_time)).all()
    for post in posts:
        post_dict = {'user_id': post.user.user_id, 'username': post.user.username , 'avatar' : post.user.avatar, 'post_id': post.post_id, 'content': post.content, 'time_created': str(post.created_time)}
        posts_list.append(post_dict)

    return dumps({'posts' : posts_list})