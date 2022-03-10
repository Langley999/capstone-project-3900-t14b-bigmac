from bookstation import db
'''
quiz_user = db.Table('quiz_user',
    db.Column('quiz_id', db.Integer, db.ForeignKey('quiz.quiz_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)

user_badge = db.Table('user_badge',
    db.Column('badge_id', db.Integer, db.ForeignKey('badge.badge_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)
'''
class Quiz_user(db.Model):
    quiz_id = db.Column('quiz_id', db.Integer, db.ForeignKey('quiz.quiz_id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    quiz = db.relationship('Quiz')
    user = db.relationship('User')

class User_badge(db.Model):
    badge_id = db.Column('badge_id', db.Integer, db.ForeignKey('badge.badge_id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    user = db.relationship('User')
    badge = db.relationship('Badge')

class Admin(db.Model):

    __tablename__ = 'admin'

    admin_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(32))
    #quizzes = db.relationship('Quiz')

class Badge(db.Model):

    __tablename__ = 'badge'

    badge_id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(1024))
    #users = db.relationship('User_badge', lazy='subquery')


class Quiz(db.Model):

    __tablename__ = 'quiz'

    quiz_id = db.Column(db.Integer, primary_key=True)
    publish_status = db.Column(db.SmallInteger)

    admin_id = db.Column(db.Integer, db.ForeignKey('admin.admin_id'), nullable=False)
    #questions = db.relationship('Question')
    #users = db.relationship('Quiz_user')

    
class Question(db.Model):

    __tablename__ = 'question'

    question_id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    description = db.Column(db.String(512))
    answer = db.Column(db.Integer)
    quiz = db.relationship('Quiz')


