from json import dumps
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, User, Post
from bookstation.utils.auth_util import get_user
from datetime import datetime

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
    following_entry = Follow_relationship(follower_user_id=user.user_id, user_id=target_user_id)
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


#TODO implement above, add avatar for user, sort time by most recent