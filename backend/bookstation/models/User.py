from bookstation import db

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(32), unique=True, nullable=False)
    token = db.Column(db.String(256))
    password = db.Column(db.String(256))

    def __init__(self, username, email, password):
        self.username = username
        self.email    = email
        self.password = password
        self.token = None

    def __repr__(self):
        return '<User %r>' % self.username  
