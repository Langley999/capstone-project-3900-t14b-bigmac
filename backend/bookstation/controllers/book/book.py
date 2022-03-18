from csv import unregister_dialect
from datetime import datetime
from json import dumps
import ast
import csv
import time
# from typing import Collection
from bookstation.models.book_sys import Collection_book, Book, Book_author, Book_genre, Genre, Review, Author
from bookstation.models.user_sys import User, Collection
from bookstation import app, request, db, error

from flask import session

import hashlib
import jwt



# @app.route("/test/daoting", methods=["GET"])
# def getTestOldway():
#     book_id = request.args.get('bookId')
#     book = Book.query.get(book_id)
#     book_dict = book.__dict__.copy()
#     book_dict.pop('_sa_instance_state', None)
#     book_dict.pop("genre_string", None)
#     genres = []
#     for genre in book.book_genre:
#         genres.append(genre.genre.name)
#     book_dict['genres'] = genres
#     reviews = []
#     for review in book.reviews:
#         reviews.append({'review_id': review.review_id, 'user_id': review.user_id, 'username': review.user.username,
#         'rating': review.rating, 'content': review.content, 'time': str(review.created_time)})

#     book_dict['reviews'] = reviews
#     return dumps(book_dict)




# @app.route("/initialise", methods=["GET"])
# def loadbooks():
#     f = open('bookstation/controllers/book/bookcsv.csv')
#     csv_reader = csv.reader(f, delimiter=',')
#     genre_set = set()
#     author_set = set()
#     first_line = True
#     #title 1 , isbn 7, pubdate 14, publiser 13, blurb 5, avg rating - , num rating -, coverimg 21, genrestring 8, authorstring 3
#     for row in csv_reader:

#         if first_line:
#             first_line = False
#             continue

#         book = Book(title=row[1], isbn=row[7], publish_date=row[14], publisher=row[13], blurb=row[5], average_rating=0, num_rating=0, cover_image=row[21], genre_string=row[8], author_string=row[3])
#         db.session.add(book)
#         #create book object

#         genres = ast.literal_eval(row[8])
#         for genre in genres:
#             if genre not in genre_set:
#                 genre_set.add(genre)
#                 db.session.add(Genre(name=genre)) #create genre object

#         #break
#         authors = row[3].split(", ")
#         for author in authors:
#             if author not in author_set:
#                 author_set.add(author)
#                 db.session.add(Author(name=author))#create author object

#     db.session.commit()
#     return dumps({"successfully loaded" : True})

# @app.route("/loadbookgenre", methods=["GET"])
# def loadbookgenre():

#     books = Book.query.all()
#     for book in books:
#         tbook_id = book.book_id
#         genres = ast.literal_eval(book.genre_string)
#         for genrename in genres:
#             genre = Genre.query.filter_by(name=genrename).first()
#             tgenre_id = genre.genre_id
#             db.session.add(book_genre(book_id=tbook_id, genre_id=tgenre_id))
#     db.session.commit()
#     return dumps({"successfully loaded joins" : True})

# @app.route("/loadbookauthor", methods=["GET"])
# def loadbookauthor():

#     books = Book.query.all()
#     for book in books:
#         tbook_id = book.book_id
#         authorslist = book.author_string.split(", ")
#         authors = set(authorslist)
#         for authorname in authors:
#             author = Author.query.filter_by(name=authorname).first()
#             tauthor_id = author.author_id
#             db.session.add(book_author(book_id=tbook_id, author_id=tauthor_id))
#     db.session.commit()
#     return dumps({"successfully loaded joins author" : True})




@app.route("/book/details", methods=["GET"])
def getDetails():
    '''
    Get book details
    Args (GET):
        bookId (integer): request bookId
    Returns:
        json object of book details
    Raises:
        InputError: no book has been found for book_id
    '''
    #get input
    book_id = request.args.get('bookId')
    book = Book.query.get(book_id)

    #check book is db
    if book == None:
        raise error.InputError(description="book does not exist")

    #remove unecessary fields
    genres = ast.literal_eval(book.genre_string)
    book_dict = book.__dict__.copy()
    book_dict.pop('_sa_instance_state', None)
    book_dict.pop("genre_string", None)
    book_dict['genres'] = genres

    #modify review dict to serialise timestamp of reivews
    reviews = []
    for review in book.reviews:
        if review.content != None:
            reviews.append({'review_id': review.review_id, 'user_id': review.user_id, 'username': review.user.username,
            'rating': review.rating, 'content': review.content, 'time': str(review.created_time)})

    book_dict['reviews'] = reviews

    return dumps(book_dict)


#get reviews for a user_id
@app.route("/book/reviews", methods=["GET"])
def getReview():
    '''
    Get reviews for a user given a book
    Args (GET):
        email
        token
        bookId (integer): book_id of user requesting reviews
    Returns:
        json object of user reviews
    '''
    #get input
    token = request.args.get('token')
    book_id = request.args.get('bookId')
    user = User.query.filter_by(token = token).first()
    #target_user_id = session.get(token)
    review = Review.query.filter_by(user_id=user.user_id, book_id=book_id).first()
    reviews = []

    #modify review dict to get rid of uncessary fields and serialize timestamp
    if review != None:
        review_dict = review.__dict__
        review_dict.pop('_sa_instance_state', None)
        review_dict['created_time'] = str(review.created_time)
        reviews.append(review_dict)
        return dumps({"reviews": reviews})
    else:
        return dumps({"reviews": []})


#add comment and rating  -------
@app.route("/book/reviews", methods=["POST"])
def addReview():
    '''
    Add comment and rating
    Args (POST):
        book_id (integer): bookId of book being dded
        user_id (integer): User who's adding
        rating (integer): rating value
        content (string): optional comment
        created_time (string): time of review creation
    Returns:
        none
    '''
    #get body
    try:
        body = request.get_json()
        token = body['token']
        new_book_id = body['book_id']
        new_rating = body['rating']
        new_content = body['content']
        new_created_time = body['created_time']
        user = User.query.filter_by(token=token).first()

    except:
        raise error.BadReqError(description="post body error")

    #extract information

    #create record
    review = Review(book_id = new_book_id, user_id = user.user_id, rating = new_rating, content = new_content, created_time = new_created_time)

    #post to databse
    db.session.add(review)
    db.session.commit()
    return dumps({"success": True})



#add rating only
@app.route("/book/ratings", methods=["POST"])
def addRating():
    '''
    Add rating only
    Args (POST):
        book_id (integer): bookId of book being dded
        email (integer): email of user who's adding
        rating (integer): rating value
        created_time (string): time of review creation
    Returns:
        none
    '''
    #get body
    body = request.get_json()

    #extract information
    book_id = body['book_id']
    token = body['token']
    user = User.query.filter_by(token=token).first()
    new_rating = body['rating']

    review = Review.query.filter_by(book_id = book_id, user_id = user.user_id).first()
    book = Book.query.get(book_id)

    if review == None:
        #create record
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = None, created_time = datetime.now())
        #post to databse
        book.average_rating = (book.num_rating * book.average_rating+new_rating)/(book.num_rating + 1)
        book.num_rating = book.num_rating + 1
        db.session.add(book)
        db.session.add(review)
        db.session.commit()
    else:
        book.average_rating = (book.num_rating * book.average_rating+new_rating-review.rating)/(book.num_rating)
        db.session.add(book)
        review.rating = new_rating
        review.created_time = datetime.now()
        db.session.add(review)
        db.session.commit()

    return dumps({"success": True})


#add rating and review
@app.route("/book/ratings_reviews", methods=["POST"])
def addRatingReview():
    '''
    Add rating and review
    Args (POST):
        book_id (integer): bookId of book being dded
        email (integer): email of user who's adding
        rating (integer): rating value
        created_time (string): time of review creation
        review (string): content of review
    Returns:
        none
    '''
    #get body
    body = request.get_json()

    #extract information
    book_id = body['book_id']
    token = body['token']
    user = User.query.filter_by(token=token).first()
    new_rating = body['rating']
    content = body['review']
    review = Review.query.filter_by(book_id = book_id, user_id = user.user_id).first()
    book = Book.query.get(book_id)

    if review == None:
        #create record
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = content, created_time = datetime.now())
        #post to databse
        book.average_rating = (book.num_rating * book.average_rating+new_rating)/(book.num_rating + 1)
        book.num_rating = book.num_rating + 1
        db.session.add(book)
        db.session.add(review)
        db.session.commit()
    else:
        book.average_rating = (book.num_rating * book.average_rating+new_rating-review.rating)/(book.num_rating)
        db.session.add(book)
        review.rating = new_rating
        review.content = content
        review.created_time = datetime.now()
        db.session.add(review)
        db.session.commit()

    return dumps({"success": True})



#add or update comment to review --------
# @app.route("/book/reviews", methods=["PUT"])
# def editReview():
#     '''
#     Add or update comment to review
#     Args (PUT):
#         review_id (integer): review being updated
#     Returns:
#         None
#     Raises:
#         BadReqError: Review cannot be updated
#     '''
#     #get body
#     body = request.get_json()

#     #extract new comment
#     target_review_id = body['review_id']
#     new_content = body['content']

#     #post to database
#     updated = Review.query.filter_by(review_id=target_review_id).update({Review.content: new_content})

#     #error check
#     if updated == None:
#         raise(error.BadReqError("Bad request cannot update"))

#     db.session.commit()
#     return dumps({"success": True})


#change rating ------
# @app.route("/book/ratings", methods=["PUT"])
# def editRating():
#     '''
#     Change rating
#     Args (PUT):
#         book_id (integer): Review being updated
#         email (string): email
#         new rating
#     Returns:
#         None
#     Raises:
#         BadReqError: Review cannot be updated to change rating value
#     '''
#     #get body
#     body = request.get_json()

#     #extract new rating
#     email = body['email']
#     book_id = body['book_id']

#     #post to database
#     updated = Review.query.filter_by(review_id=target_review_id).update({Review.rating: new_rating})

#     #error check
#     if updated == None:
#         raise(error.BadReqError("Bad request cannot update"))

#     db.session.commit()
#     return dumps({"success": True})




#delete review
@app.route("/book/ratings", methods=["DELETE"])
def removeRating():
    '''
    Delete review
    Args (DELETE):
        review_id (integer): review being deleted
    Returns:
        None
    Raises:
        BadReqError: Review cannot be deleted
    '''
    #get body
    body = request.get_json()

    #get review_id of for deleted review
    target_review_id = body['review_id']

    deleted = Review.query.filter_by(review_id=target_review_id).delete()

    #error check
    if deleted == None:
        raise(error.BadReqError("Bad request cannot delete"))

    db.session.commit()
    return dumps({"success": True})

#complete reading
@app.route("/book/completereading", methods=["POST"])
def completeReading():
    '''
    Delete review
    Args (DELETE):
        review_id (integer): review being deleted
    Returns:
        None
    Raises:
        BadReqError: Review cannot be deleted
    '''
    try:
        data = request.get_json()
        token, book_id = data['token'], data['book_id']
    except:
        raise error.BadReqError(description="post body error")

    user = User.query.filter_by(token=token).first()

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
        db.session.flush()
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection != None:
      raise error.BadReqError(description="This book has already been added to the collection")

    try:
      new_book_collection = Collection_book(collection.collection_id, book_id, datetime.now())
      db.session.add(new_book_collection)
      db.session.commit()

      return dumps({
          "success": []
      })
    except:
      raise error.BadReqError(description="Cannot add the book to this collection")



#add rating and review
@app.route("/book/check_completed", methods=["GET"])
def checkCompleted():
    '''
    Add rating and review
    Args (GET):
        book_id (integer): bookId of book being dded
        email (integer): email of user who's adding
        token
    Returns:
        none
    '''
    #extract information
    token = request.args.get('token')
    book_id = request.args.get('bookId')
    user = User.query.filter_by(token).first()
    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
        db.session.flush()
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection != None:
        return dumps({"success": True})
    else:
        return dumps({"success": False})
