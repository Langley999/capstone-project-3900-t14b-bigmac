from json import dumps
from bookstation.models.event_sys import Admin
from bookstation import app, request, db, error
from bookstation.models.user_sys import Follow_relationship, User, Post

from bookstation.utils.auth_util import get_user
from datetime import date, datetime
from sqlalchemy import desc



@app.route("/admin/login", methods=["POST"])
def adminlogin():

    body = request.get_json()
    admin_id = body.get('admin_id')
    password = body.get('password')
    
    admin = Admin.query.get(admin_id)
    if admin == None:
        raise error.NotFoundError(description='Target admin not found')
    if password != admin.password:
        raise error.BadReqError(description= 'Wrong password')

    return dumps({'success':[]})

@app.route("/admin/login", methods=["POST"])
def loginadmin():
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
