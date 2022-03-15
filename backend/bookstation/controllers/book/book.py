from csv import unregister_dialect
from datetime import datetime
from json import dumps
import ast
import csv
import time
# from typing import Collection
from bookstation.models.book_sys import Collection_book, Book,Genre, Review, Author
from bookstation.models.user_sys import User, Collection
from bookstation import app, request, db, error


from flask import session

import hashlib
import jwt


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
    target_user_id = session.get(token)
    user = User.query.get(target_user_id)
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
    target_user_id = session.get(token)
    user = User.query.get(target_user_id)
    new_rating = body['rating']
    content = body['review']
    review = Review.query.filter_by(book_id = book_id, user_id = user.user_id).first()
    if review == None:
        #create record
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = content, created_time = datetime.now())
        #post to databse
        db.session.add(review)
        db.session.commit()
    else:
        review.rating = new_rating
        review.content = content
        review.created_time = datetime.now()
        db.session.add(review)
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

    target_user_id = session.get(token)
    user = User.query.get(target_user_id)

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



#check completed
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
    target_user_id = session.get(token)
    user = User.query.get(target_user_id)
    book_id = request.args.get('bookId')
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