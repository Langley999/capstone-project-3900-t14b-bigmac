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
    book = db.relationship('Book', back_populates='authors')
    author = db.relationship('Author', back_populates='books')
    
class Author(db.Model):

    __tablename__ = 'author'

    author_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    books = db.relationship('Book_author', back_populates='author')

class Genre(db.Model):

    __tablename__ = 'genre'

    genre_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    books = db.relationship('Book', secondary=book_genre)

class Collection_book(db.Model):

    __tablename__ = 'collection_book'

    collection_book_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.collection_id'))
    created_time = db.Column(db.Time)
    finish_time = db.Column(db.Time)
    book = db.relationship('Book', back_populates='collections')
    collection = db.relationship('Collection', back_populates='books')

class Review(db.Model):

    __tablename__ = 'review'

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('book.book_id'))
    rating = db.Column(db.SmallInteger)
    content = db.Column(db.String(2048))
    created_time = db.Column(db.Time)
    book = db.relationship('Book', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    def __init__(self, rating):
        self.rating = rating

class Book(db.Model):

    __tablename__ = 'book'

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    isbn = db.Column(db.String(32))
    publish_date = db.Column(db.String(32))
    publisher = db.Column(db.String(256))
    blurb = db.Column(db.String(1024))
    average_rating = db.Column(db.Float)
    num_rating = db.Column(db.Integer)
    cover_image = db.Column(db.String(512))
    genre_string = db.Column(db.String(4096))
    author_string = db.Column(db.String(512))
    genres = db.relationship("Genre", secondary=book_genre)
    reviews = db.relationship('Review', back_populates='book')
    authors = db.relationship('Book_author', back_populates='book')
    collections = db.relationship('Collection_book', back_populates='book')
