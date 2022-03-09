from csv import unregister_dialect
from json import dumps
import time
from bookstation import app, request, db, error
from bookstation.models.book_sys import Book, Genre, Review
from flask import session
from config import SECRET
import hashlib
import jwt




@app.route("/book/details", methods=["GET"])
def getDetails():
    book_id = request.args.get('bookId')
    book = Book.query.get(book_id)
    reviews = book.reviews
    for review in reviews:
        print(review.review_id, review.book_id, review.content, review.created_time)
    print(reviews)
    book_dict = book.__dict__
    response_body = {'reviews': []}
    return dumps(response_body)


@app.route("/book/reviews", methods=["POST"])
def addReview():
    body = request.get_json()
    new_book_id = body['book_id']
    new_user_id = body['user_id']
    new_rating = body['rating']
    new_content = body['content']
    new_created_time = body['created_time']
    
    review = Review(book_id = new_book_id, user_id = new_user_id, rating = new_rating, content = new_content, created_time = new_created_time)
    db.session.add(review)
    db.session.commit()
    
    return dumps({"sucess": True})

@app.route("/book/ratings", methods=["POST"])
def addRating():
    
    return

@app.route("/book/ratings", methods=["PUT"])
def editRating():
    return

@app.route("/book/reviews", methods=["PUT"])
def editReview():
    return

@app.route("/book/rating", methods=["DELETE"])
def removeRating():
    return
