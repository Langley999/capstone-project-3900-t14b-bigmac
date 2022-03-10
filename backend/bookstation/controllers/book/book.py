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

#delete review
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
 
