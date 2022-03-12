from csv import unregister_dialect
from json import dumps
import ast
import time
from bookstation import app, request, db, error
from bookstation.models.book_sys import Book, Genre, Review, Collection_book
from bookstation.models.user_sys import User, Collection
from flask import session
from config import SECRET
from datetime import datetime
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
        reviews.append({'review_id': review.review_id, 'user_id': review.user_id, 'username': review.user.username,
        'rating': review.rating, 'content': review.content, 'time': str(review.created_time)})

    book_dict['reviews'] = reviews

    return dumps(book_dict)


#get reviews for a user_id
@app.route("/book/reviews", methods=["GET"])
def getReview():
    '''
    Get reviews for a user_id
    Args (GET):
        userId (integer): user_id of user requesting reviews

    Returns:
        json object of user reviews
    '''     
    #get input
    target_user_id = request.args.get('userId')
    review_rows = Review.query.filter_by(user_id=target_user_id).all()
    reviews = []

    #modify review dict to get rid of uncessary fields and serialize timestamp
    for review in review_rows:
        review_dict = review.__dict__
        review_dict.pop('_sa_instance_state', None)
        review_dict['created_time'] = str(review.created_time)
        reviews.append(review_dict)
    
    return dumps({"reviews": reviews})


#add comment and rating
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
    body = request.get_json()

    #extract information
    new_book_id = body['book_id']
    new_user_id = body['user_id']
    new_rating = body['rating']
    new_content = body['content']
    new_created_time = body['created_time']
    
    #create record
    review = Review(book_id = new_book_id, user_id = new_user_id, rating = new_rating, content = new_content, created_time = new_created_time)

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
        user_id (integer): User who's adding
        rating (integer): rating value
        created_time (string): time of review creation

    Returns:
        none
    '''  
    #get body
    body = request.get_json()

    #extract information
    new_book_id = body['book_id']
    new_user_id = body['user_id']
    new_rating = body['rating']
    new_created_time = body['created_time']

    #create record
    review = Review(book_id = new_book_id, user_id = new_user_id, rating = new_rating, content = None, created_time = new_created_time)

    #post to databse
    db.session.add(review)
    db.session.commit()
    return dumps({"success": True})



#add or update comment to review
@app.route("/book/reviews", methods=["PUT"])
def editReview():
    '''
    Add or update comment to review
    Args (PUT):
        review_id (integer): review being updated

    Returns:
        None
    Raises:
        BadReqError: Review cannot be updated
    '''  
    #get body
    body = request.get_json()

    #extract new comment
    target_review_id = body['review_id']
    new_content = body['content']

    #post to database
    updated = Review.query.filter_by(review_id=target_review_id).update({Review.content: new_content})

    #error check
    if updated == None:
        raise(error.BadReqError("Bad request cannot update"))

    db.session.commit()
    return dumps({"success": True})



#change rating
@app.route("/book/ratings", methods=["PUT"])
def editRating():
    '''
    Change rating
    Args (PUT):
        review_id (integer): Review being updated
    Returns:
        None
    Raises:
        BadReqError: Review cannot be updated to change rating value
    '''  
    #get body
    body = request.get_json()

    #extract new rating
    target_review_id = body['review_id']
    new_rating = body['rating']

    #post to database
    updated = Review.query.filter_by(review_id=target_review_id).update({Review.rating: new_rating})

    #error check
    if updated == None:
        raise(error.BadReqError("Bad request cannot update"))

    db.session.commit()
    return dumps({"success": True})




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
    try:
        data = request.get_json()
        email, book_id = data['email'], data['book_id']
    except:
        raise error.BadReqError(description="post body error")

    user = User.query.filter_by(email = email).first()
 
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
 
