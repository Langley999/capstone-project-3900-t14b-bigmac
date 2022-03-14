from redis import AuthenticationWrongNumberOfArgsError
from bookstation import db
#from bookstation.models.user_sys import User

class Book_author(db.Model):
    book_id = db.Column('book_id', db.Integer, db.ForeignKey('book.book_id'), primary_key=True)
    author_id = db.Column('author_id', db.Integer, db.ForeignKey('author.author_id'), primary_key=True)
    book = db.relationship('Book')

class Book_genre(db.Model):
    book_id = db.Column('book_id', db.Integer, db.ForeignKey('book.book_id'), primary_key=True)
    genre_id = db.Column('genre_id', db.Integer, db.ForeignKey('genre.genre_id'), primary_key=True)
    book = db.relationship('Book')

    #genre = db.relationship('Genre') #comment this out

class Author(db.Model):

    __tablename__ = 'author'

    author_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

class Genre(db.Model):

    __tablename__ = 'genre'

    genre_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))


class Collection_book(db.Model):

    __tablename__ = 'collection_book'

    collection_book_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.collection_id'))
    created_time = db.Column(db.DateTime)
    finish_time = db.Column(db.DateTime)

    book = db.relationship('Book')

    def __init__(self, collection_id, book_id, created_time):
        self.collection_id  = collection_id
        self.book_id = book_id
        self.created_time = created_time
        self.finish_time = created_time


class Review(db.Model):

    __tablename__ = 'review'

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    user = db.relationship('User')
    rating = db.Column(db.SmallInteger)
    content = db.Column(db.String(2048))
    created_time = db.Column(db.DateTime)



class Book(db.Model):

    __tablename__ = 'book'

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    isbn = db.Column(db.String(32))
    publish_date = db.Column(db.String(128))
    publisher = db.Column(db.String(256))
    blurb = db.Column(db.String(1024))
    average_rating = db.Column(db.Float)
    num_rating = db.Column(db.Integer)
    cover_image = db.Column(db.String(512))
    genre_string = db.Column(db.String(4096))
    author_string = db.Column(db.String(512))
    reviews = db.relationship('Review')

    #book_genre = db.relationship('Book_genre') #comment this out

