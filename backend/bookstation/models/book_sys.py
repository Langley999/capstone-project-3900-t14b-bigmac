from bookstation import db

book_genre = db.Table('book_genre',
    db.Column('book_id', db.Integer, db.ForeignKey('book.book_id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.genre_id'), primary_key=True)
)

class Book_author(db.Model):
    
    __tablename__ = 'book_author'

    book_author_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    author_id = db.Column(db.Integer, db.ForeignKey('author.author_id'))
    role = db.Column(db.String(32))
    
class Author(db.Model):

    __tablename__ = 'author'

    author_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    books = db.relationship('Book', secondary=Book_author.__tablename__, backref='author')

class Genre(db.Model):

    __tablename__ = 'genre'

    genre_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    books = db.relationship('Book', secondary=book_genre, lazy='subquery',
        backref=db.backref('genres', lazy=True))

class Collection_book(db.Model):

    __tablename__ = 'collection_book'

    collection_book_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.collection_id'))
    created_time = db.Column(db.Time)
    finish_time = db.Column(db.Time)

class Review(db.Model):

    __tablename__ = 'review'

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    rating = db.Column(db.SmallInteger)
    content = db.Column(db.String(2048))
    created_time = db.Column(db.Time)

    def __init__(self, rating):
        self.rating = rating

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
    reviews = db.relationship('User', secondary=Review.__tablename__, backref='book')
    collections = db.relationship('Collection', secondary=Collection_book.__tablename__, backref='book')
    authors = db.relationship('Author', secondary=Book_author.__tablename__, backref='book')
