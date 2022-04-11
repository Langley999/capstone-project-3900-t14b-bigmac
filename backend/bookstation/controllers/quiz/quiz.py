from getpass import getuser
from json import dumps

from pymysql import NULL
from sympy import true
from bookstation.models.event_sys import Quiz_user, User_badge
from bookstation.models.event_sys import Question, Answer, Badge
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
    admin.token = token
    db.session.add(admin)
    db.session.commit()
    return dumps({'id':admin.admin_id ,'token': token})

@app.route("/admin/logout", methods=["POST"])
def adminlogout():

    body = request.get_json()
    token = body.get('token')
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
        raise error.NotFoundError(description='Target admin not found')
    else:
        admin.token=NULL
        db.session.add(admin)
        db.session.commit()
    return dumps({'success':[]})


@app.route("/quiz/createquiz", methods=["POST"])
def createquiz():
    
    body = request.get_json()
    token = body.get('token')
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
        raise error.NotFoundError(description='Target admin not found')
    id = body.get('id')
    print(id)
    quizname = body.get('name')
    description = body.get('description')
    badge = body.get('badge')
    newbadge = Badge(image=badge)
    db.session.add(newbadge)
    db.session.commit()
    db.session.flush()

    new_quiz = Quiz(publish_status=0, admin_id=id,quiz_name=quizname,description=description,badge_id=newbadge.badge_id)

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
 
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
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

@app.route("/quiz/getopenquiz", methods=["GET"])
def getopenquiz():
    token = request.args.get('token')
 
    user = get_user(token)
    quizzes = Quiz.query.filter_by(publish_status=1).all()
    result = []
    
    for quiz in quizzes:
        quiz_id = quiz.quiz_id
        quiz_name = quiz.quiz_name
        badge = Badge.query.get(quiz.badge_id)
        quizobj = {}
        quizobj['id'] = quiz_id
        quizobj['description'] = quiz.description
        quizobj['quiz_name'] = quiz_name
        quizobj['badge_id'] = badge.badge_id
        quizobj['badge_image'] = badge.image
        if User_badge.query.filter_by(badge_id=badge.badge_id,user_id=user.user_id).first() != None:
            quizobj['complete_status'] = "PASS"
        elif Quiz_user.query.filter_by(quiz_id=quiz_id,user_id=user.user_id).first() != None:
            quizobj['complete_status'] = "FAIL"
        else:
            quizobj['complete_status'] = "NONE"
        result.append(quizobj)
  
    return dumps({ 'quizzes' : result})

@app.route("/quiz/openquiz", methods=["POST"])
def openquiz():
    body = request.get_json()
    token = body.get('token')
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
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
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
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
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
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



@app.route("/quiz/editquiz", methods=["PUT"])
def updatequiz():
    
    body = request.get_json()
    token = body.get('token')
    admin = Admin.query.filter_by(token=token).first()
    if admin == None:
        raise error.NotFoundError(description='Target admin not found')
    id = int(body.get('id'))
    quizname = body.get('name')
    description = body.get('description')
    badgeimg = body.get('badge')
    quizinfo = Quiz.query.get(id)
    quizinfo.quiz_name = quizname
    quizinfo.description = description
    badge = Badge.query.get(quizinfo.badge_id)
    badge.image = badgeimg
    db.session.add(quizinfo)
    db.session.add(badge)
    db.session.commit()
    db.session.flush()
    questions = Question.query.filter_by(quiz_id=id).all()
    for question in questions:
      answers = Answer.query.filter_by(question_id=question.question_id).all()
      for answer in answers:
        db.session.delete(answer)
      db.session.delete(question)
    db.session.commit()
    db.session.flush()

    questions = body.get('questions')
    for question in questions:
      question_des= question['question']
      new_q = Question(quiz_id=id, description=question_des)
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


    '''
    print(id)


    #new_quiz = Quiz(publish_status=0, admin_id=id,quiz_name=quizname,description=description,badge_id=newbadge.badge_id)
 
    quizinfo['quiz_name'] = quizname
    quizinfo['description'] = description
    badge = Badge.query.get(quizinfo['badge_id'])
    badge['image'] = badge
    db.session.add(quizinfo)
    db.session.add(badge)
    db.session.commit()
    db.session.flush()

    questions = body.get('questions')
    for question in questions:
        qid = question['id']
        questioninfo = Question.query.get(qid)
        questioninfo['description'] = question['question']
    
        db.session.add(questioninfo)
        db.session.commit()
        db.session.flush()

        answers = question['ans']
        for answer in answers:
            ansinfo = Answer.query.get(answer['id'])
            ansinfo['description'] = answer['content']
            ansinfo['tag'] = answer['is_correct']
            
            db.session.add(ansinfo)
            db.session.commit()
    '''
    return dumps({ 'success' : []})




@app.route("/quiz/getquiz", methods=["GET"])
def getquiz():
    token = request.args.get('token')
    admin = Admin.query.filter_by(token=token).first()
    user = get_user(token)
    if admin == None and user == None:
        raise error.NotFoundError(description='No access right')

    quizid = int(request.args.get('quiz_id'))
    quiz = Quiz.query.get(quizid)
    badge = Badge.query.get(quiz.badge_id)
    #new_quiz = Quiz(publish_status=0, admin_id=id,quiz_name=quizname,description=description,badge_id=newbadge.badge_id)

    questionlist = []
    questions = Question.query.filter_by(quiz_id=quizid).all()
    for question in questions:
        questioninfo = {}
        qid = question.question_id
        questioninfo['id'] = qid
        questioninfo['question'] = question.description
        questioninfo['ans'] = []


        answers = Answer.query.filter_by(question_id=qid)
        for answer in answers:
            ansinfo = {}
            ansinfo['id'] = answer.answer_id
            ansinfo['content'] = answer.description
            if answer.tag == 1:
                ansinfo['is_correct'] = True
            else:
                ansinfo['is_correct'] = False
            questioninfo['ans'].append(ansinfo)
        questionlist.append(questioninfo)
  
    return dumps({ 
        'quizname': quiz.quiz_name,
        'description': quiz.description,
        'badge': badge.image,
        'questions': questionlist
    })


def getrightanswer(q_id):
    ans = Answer.query.filter_by(question_id=q_id).all()
    for answer in ans:
        if answer.tag == True:
            return answer.answer_id

@app.route("/quiz/submitanswer", methods=["POST"])
def checkanswer():
    body = request.get_json()
    token = body.get('token')
    anslist = body.get('ans')
    print(anslist)
    quiz_id = body.get('quiz_id')
    status = "FAIL"
    user = get_user(token)
    if user == None:
        raise error.NotFoundError(description='No access right')
    
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    print(questions)
    totalpoints = len(questions)
    gainedpoints = 0
    for question in questions:
        if anslist[str(question.question_id)] == getrightanswer(question.question_id):
            gainedpoints +=1
    if round(gainedpoints/totalpoints,2) >= 0.6:
        status = "PASS"
        quiz = Quiz.query.get(int(quiz_id))
        if User_badge.query.filter_by(badge_id = quiz.badge_id,user_id = user.user_id).first() == None:
            newuser_badge = User_badge(badge_id = quiz.badge_id,user_id = user.user_id)
            db.session.add(newuser_badge)
            db.session.commit()
    if Quiz_user.query.filter_by(quiz_id=quiz_id,user_id=user.user_id).first() == None:
        newquiz_user = Quiz_user(quiz_id=quiz_id,user_id=user.user_id)
        db.session.add(newquiz_user)
        db.session.commit()

    
    return dumps({ 
        'status': status,
        'result': round(gainedpoints/totalpoints,2)*100
    })
'''
@app.route("/quiz/checkcompleted", methods=["GET"])
def checkcompleted():
    body = request.get_json()
    token = body.get('token')
    anslist = body.get('ans')
    quiz_id = body.get('quiz_id')
    status = "FAIL"
    user = get_user(token)
    if user == None:
        raise error.NotFoundError(description='No access right')
    
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    totalpoints = len(questions)
    gainedpoints = 0
    for question in questions:
        if anslist[question.question_id] == getrightanswer(question.question_id):
            gainedpoints +=1
    if gainedpoints >= totalpoints*0.6:
        status = "PASS"
        quiz = Quiz.query.get(int(quiz_id))
        newuser_badge = User_badge(badge_id = quiz.badge_id,user_id = user.user_id)
        db.session.add(newuser_badge)
    newquiz_user = Quiz_user(quiz_id=quiz_id,user_id=user.user_id)
    db.session.add(newquiz_user)
    db.session.commit()

    
    return dumps({ 
        status: status
    })
'''