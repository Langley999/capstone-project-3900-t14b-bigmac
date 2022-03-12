from bookstation import db
#from bookstation.models.book_sys import Collection_book

class Follow_relationship(db.Model):
    follower_user_id = db.Column('follower_user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
    follower_user = db.relationship("User", foreign_keys=[follower_user_id])
    followed_user = db.relationship("User", foreign_keys=[user_id])

class User(db.Model):

    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(256))

    def __init__(self, username, email, password):
        self.username   = username
        self.email      = email
        self.password   = password

class Post(db.Model):

    __tablename__ = 'post'

    post_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    content = db.Column(db.String(1024))
    created_time = db.Column(db.Time)
    user = db.relationship('User')

    def __init__(self, content):
        self.content = content

class Collection(db.Model):

    __tablename__ = 'collection'

    collection_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    is_default = db.Column(db.Integer)
    created_time = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    #books = db.relationship('Collection_book')

    user = db.relationship('User')


    def __init__(self, is_default, name, time, user_id):
        self.is_default = is_default
        self.name = name
        self.created_time = time
        self.user_id = user_id

class Goal(db.Model):
    __tablename__ = 'goals'
    goal_id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    books_set = db.Column(db.Integer)
    books_completed = db.Column(db.Integer)
    def __init__(self, goal_id, user_id, created_date, books_set,books_completed):
        self.goal_id = goal_id
        self.user_id = user_id
        self.created_time = created_date
        self.books_set = books_set
        self.books_completed = books_completed
