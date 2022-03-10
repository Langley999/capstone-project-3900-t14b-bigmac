from bookstation import db
#from bookstation.models.book_sys import Collection_book
'''
follow_relationship = db.Table('follow_relationship',
    db.Column('follower_user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)
'''

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

    posts = db.relationship('Post', backref='user', lazy=True)
    collections = db.relationship('Collection', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    # followers may contain some bugs
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
    created_time = db.Column(db.DateTime)


    def __init__(self, content):
        self.content = content

class Collection(db.Model):

    __tablename__ = 'collection'

    collection_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    is_default = db.Column(db.Integer)
    created_time = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)

    books = db.relationship('Collection_book')
    user = db.relationship('User')


    def __init__(self, is_default, name, time, user_id):
        self.is_default = is_default
        self.name = name
        self.created_time = time
        self.user_id = user_id
