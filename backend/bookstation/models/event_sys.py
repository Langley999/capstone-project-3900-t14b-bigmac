from bookstation import db

quiz_user = db.Table('quiz_user',
    db.Column('quiz_id', db.Integer, db.ForeignKey('quiz.quiz_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)

user_badge = db.Table('user_badge',
    db.Column('badge_id', db.Integer, db.ForeignKey('badge.badge_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)

class Admin(db.Model):

    __tablename__ = 'admin'

    admin_id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(32))
    quizzes = db.relationship('Quiz', backref='admin', lazy=True)

class Badge(db.Model):

    __tablename__ = 'badge'

    badge_id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(1024))
    users = db.relationship('User', secondary=user_badge, lazy='subquery',
        backref=db.backref('badges', lazy=True))

    def __init__(self, image):
        self.image = image

class Quiz(db.Model):

    __tablename__ = 'quiz'

    quiz_id = db.Column(db.Integer, primary_key=True)
    publish_status = db.Column(db.SmallInteger)

    admin_id = db.Column(db.Integer, db.ForeignKey('admin.admin_id'), nullable=False)
    questions = db.relationship('Question', backref='quiz', lazy=True)
    users = db.relationship('User', secondary=quiz_user, lazy='subquery',
        backref=db.backref('quizzes', lazy=True))

    def __init__(self, admin_id):
        self.admin_id = admin_id
        self.publish_status = 0

    def change_publish(self, option):
        self.publish_status = option
    
class Question(db.Model):

    __tablename__ = 'question'

    question_id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    description = db.Column(db.String(512))
    answer = db.Column(db.Integer)

    def __init__(self, description, answer):
        self.description = description
        self.answer = answer
