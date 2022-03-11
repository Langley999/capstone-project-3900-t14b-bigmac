from csv import unregister_dialect
from json import dumps
import ast
import time
from bookstation import app, request, db, error
from bookstation.models.book_sys import Book, Genre, Review
from flask import session
from config import SECRET
import hashlib
import jwt

'''
@app.route("/test", methods=["GET"])
def getTest():
    Review.query.get(1)
    return dumps({})

@app.route("/test/daoting", methods=["GET"])
def getTestOldway():
    book_id = request.args.get('bookId')
    book = Book.query.get(book_id)
    book_dict = book.__dict__.copy()
    book_dict.pop('_sa_instance_state', None)
    book_dict.pop("genre_string", None)
    genres = []
    for genre in book.book_genre:
        genres.append(genre.genre.name)
    book_dict['genres'] = genres
    reviews = []
    for review in book.reviews:
        reviews.append({'review_id': review.review_id, 'user_id': review.user_id, 'username': review.user.username,
        'rating': review.rating, 'content': review.content, 'time': str(review.created_time)})
    print(reviews)
    book_dict['reviews'] = reviews
    return dumps(book_dict)
'''

#get book details
@app.route("/book/details", methods=["GET"])
def getDetails():
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
    print(reviews)
    book_dict['reviews'] = reviews

    return dumps(book_dict)


#get reviews for a user_id
@app.route("/book/reviews", methods=["GET"])
def getReview():
    #get input
    target_user_id = request.args.get('userId')
    review_rows = Review.query.filter_by(user_id=target_user_id).all()
    reviews = []

    #check review in db
    if review_rows == None:
        print("review none")
        raise error.InputError(description="review does not exist")

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
    return dumps({"sucess": True})



#add rating only
@app.route("/book/ratings", methods=["POST"])
def addRating():
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
    return dumps({"sucess": True})



#add or update comment to review
@app.route("/book/reviews", methods=["PUT"])
def editReview():
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
    return dumps({"sucess": True})



#change rating
@app.route("/book/ratings", methods=["PUT"])
def editRating():
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
    return dumps({"sucess": True})




#delete review
@app.route("/book/ratings", methods=["DELETE"])
def removeRating():
    #get body
    body = request.get_json()

    #get review_id of for deleted review
    target_review_id = body['review_id']

    deleted = Review.query.filter_by(review_id=target_review_id).delete()

    #error check
    if deleted == None:
        raise(error.BadReqError("Bad request cannot delete"))

    db.session.commit()
    return dumps({"sucess": True})
