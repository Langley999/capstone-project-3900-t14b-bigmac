from json import dumps
from bookstation.models.event_sys import Quiz
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

    return dumps({'id':admin.admin_id})

@app.route("/quiz/createquiz", methods=["POST"])
def loginadmin():
    
    body = request.get_json()
    id = body.get('id')
    print(id)
    quizname = body.get('name')
    new_quiz = Quiz(publish_status=0, admin_id=id)

    db.session.add(new_quiz)
    db.session.commit()
    db.session.flush()
    print(new_quiz.quiz_id)
    '''
    

    questions = body.get('questions')
    for question in questions:
      question_name = question['question']

      answers = question['answers']
      for answer in answers:
        label = answer['label']
        content = answer['content']
        is_correct = answer['is_correct']
      
    '''
    return dumps({ 'users' : []})
