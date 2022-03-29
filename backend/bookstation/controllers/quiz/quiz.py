from json import dumps
from bookstation.models.event_sys import Question, Answer
from bookstation.models.event_sys import Quiz
from bookstation.models.event_sys import Admin
from bookstation import app, request, db, error, admintoken
from bookstation.models.user_sys import Follow_relationship, User, Post

from bookstation.utils.auth_util import get_user, generate_token
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
    token = generate_token(str(admin_id))
    admintoken[token] = admin_id
    return dumps({'id':admin.admin_id ,'token': token})

@app.route("/admin/logout", methods=["POST"])
def adminlogout():

    body = request.get_json()
    token = body.get('token')
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    else:
        admintoken.pop(token)
    return dumps({'success':[]})


@app.route("/quiz/createquiz", methods=["POST"])
def createquiz():
    
    body = request.get_json()
    token = body.get('token')
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    id = body.get('id')
    print(id)
    quizname = body.get('name')
    new_quiz = Quiz(publish_status=0, admin_id=id,quiz_name=quizname)

    db.session.add(new_quiz)
    db.session.commit()
    db.session.flush()
    print(new_quiz.quiz_id)

    questions = body.get('questions')
    for question in questions:
      question_des= question['question']
      new_q = Question(quiz_id=new_quiz.quiz_id, description=question_des)
      db.session.add(new_q)
      db.session.commit()
      db.session.flush()

      answers = question['ans']
      for answer in answers:
        content = answer['content']
        is_correct = answer['is_correct']
        new_ans = Answer(question_id=new_q.question_id, description=content,tag=is_correct)
        db.session.add(new_ans)
        db.session.commit()
  
    return dumps({ 'success' : []})

@app.route("/quiz/getallquiz", methods=["GET"])
def getallquiz():
    token = request.args.get('token')
 
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    quizzes = Quiz.query.order_by(desc(Quiz.publish_status)).all()
    result = []
    for quiz in quizzes:
      quiz_id = quiz.quiz_id
      quiz_name = quiz.quiz_name
      questions = Question.query.filter_by(quiz_id=quiz_id).all()
      questionlist = []
      for question in questions:
        q_content = question.description
        q_id = question.question_id
        answers = Answer.query.filter_by(question_id=q_id).all()
        ansl = []
        for answer in answers:
          ans = {}
          ans['id'] = answer.answer_id
          ans['content'] = answer.description
          ans['is_correct'] = answer.tag
          ansl.append(ans)
        q = {}
        q['question'] = q_content
        q['id'] = q_id
        q['answers'] = ansl
        questionlist.append(q)
      quizobj = {}
      quizobj['id'] = quiz_id
      quizobj['status'] = quiz.publish_status
      quizobj['quiz_name'] = quiz_name
      quizobj['questions'] = questionlist
      result.append(quizobj)
  
    return dumps({ 'quizzes' : result})

@app.route("/quiz/openquiz", methods=["POST"])
def openquiz():
    body = request.get_json()
    token = body.get('token')
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    quiz_id = body.get('quiz_id')
    
    quiz = Quiz.query.get(quiz_id)
    if quiz == None:
        raise error.NotFoundError(description='Target quiz not found')
    if quiz.publish_status == 1:
        raise error.BadReqError(description= 'Quiz already opened')
    quiz.publish_status = 1
    db.session.add(quiz)
    db.session.commit()
    return dumps({ 'success' :[] })


@app.route("/quiz/closequiz", methods=["POST"])
def closequiz():
    body = request.get_json()
    token = body.get('token')
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    quiz_id = body.get('quiz_id')
    
    quiz = Quiz.query.get(quiz_id)
    if quiz == None:
        raise error.NotFoundError(description='Target quiz not found')
    if quiz.publish_status == 0:
        raise error.BadReqError(description= 'Quiz already closed')
    quiz.publish_status = 0
    db.session.add(quiz)
    db.session.commit()
    return dumps({ 'success' :[] })


@app.route("/quiz/deletequiz", methods=["DELETE"])
def deletequiz():
    body = request.get_json()
    quiz_id = body.get('quiz_id')
    token = body.get('token')
    if token not in admintoken:
        raise error.NotFoundError(description='Target admin not found')
    quiz = Quiz.query.get(quiz_id)
    if quiz == None:
        raise error.NotFoundError(description='Target quiz not found')
    
    
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    for question in questions:
      answers = Answer.query.filter_by(question_id=question.question_id).all()
      for answer in answers:
        db.session.delete(answer)
      db.session.delete(question)
    db.session.delete(quiz)
    db.session.commit()
    return dumps({ 'success' :[] })