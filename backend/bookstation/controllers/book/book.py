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




@app.route("/book/details", methods=["GET"])
def getDetails():
    book_id = request.args.get('bookId')
    book = Book.query.get(book_id)
    #print(book.__dict__)
    genres = ast.literal_eval(book.genre_string)
    book_dict = book.__dict__.copy()
    book_dict.pop('_sa_instance_state', None)
    book_dict.pop("genre_string", None)
    book_dict['genres'] = genres
    #book_dict.pop('publish_date')
    #book_dict.pop('reviews', None)
    
    reviews = []
    for review in book.reviews:
        reviews.append({'review_id': review.review_id, 'user_id': review.user_id, 'username': review.user.username,
        'rating': review.rating, 'content': review.content, 'time': str(review.created_time)})
    print(reviews)
    book_dict['reviews'] = reviews
    #out = {'id': book_id, 'img': book.cover_image, 'title': book.title, 'desc': book.blurb, 'authors': book.author_string, 'publishers' : book.publisher, 'publish_date': book.publish_date, 'isbn': book.isbn, 'genres': genres, 'reviews': reviews}
    return dumps(book_dict)


#add review and rating
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

#add rating only
@app.route("/book/ratings", methods=["POST"])
def addRating():
    body = request.get_json()
    new_book_id = body['book_id']
    new_user_id = body['user_id']
    new_rating = body['rating']
    new_created_time = body['created_time']
    review = Review(book_id = new_book_id, user_id = new_user_id, rating = new_rating, content = None, created_time = new_created_time)
    db.session.add(review)
    db.session.commit()
    return dumps({"sucess": True})

#add comment to review
@app.route("/book/reviews", methods=["PUT"])
def editReview():
    body = request.get_json()
    treview_id = body['review_id']
    new_content = body['content']
    updated = Review.query.filter_by(review_id=treview_id).update({Review.content: new_content})
    db.session.commit()
    return dumps({"sucess": True})

#change rating
@app.route("/book/ratings", methods=["PUT"])
def editRating():
    body = request.get_json()
    treview_id = body['review_id']
    new_rating = body['rating']
    updated = Review.query.filter_by(review_id=treview_id).update({Review.rating: new_rating})
    db.session.commit()
    return dumps({"sucess": True})

#delete review
@app.route("/book/ratings", methods=["DELETE"])
def removeRating():
    body = request.get_json()
    treview_id = body['review_id']
    deleted = Review.query.filter_by(review_id=treview_id).delete()
    db.session.commit()
    return dumps({"sucess": True})
