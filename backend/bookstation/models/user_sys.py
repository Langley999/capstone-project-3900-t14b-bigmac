from bookstation import db
from bookstation.models.book_sys import Collection_book, Review

follow_relationship = db.Table('follow_relationship',
    db.Column('follower_user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)

class User(db.Model):

    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(256))
    posts = db.relationship('Post', back_populates='user', lazy=True)
    collections = db.relationship('Collection', back_populates='user', lazy=True)
    reviews = db.relationship('Review', back_populates='user', lazy=True)
    followers = db.relationship('User',
                                secondary=follow_relationship,
                                primaryjoin=user_id==follow_relationship.c.user_id,
                                secondaryjoin=user_id==follow_relationship.c.follower_user_id,
                                backref="followings")

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
    user = db.relationship("User", back_populates='posts')

    def __init__(self, content):
        self.content = content

class Collection(db.Model):

    __tablename__ = 'collection'

    collection_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    is_default = db.Column(db.Integer)
    created_time = db.Column(db.Time)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    books = db.relationship('Collection_book', back_populates='collection')
    user = db.relationship("User", back_populates='collections')

    def __init__(self, name):
        self.is_default = 0
        self.name = name
