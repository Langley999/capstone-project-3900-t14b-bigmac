from csv import unregister_dialect
from datetime import datetime
from json import dumps
import ast
import csv
import math
import time

from itsdangerous import NoneAlgorithm
from bookstation.models.user_sys import Post
# from typing import Collection
from bookstation.models.book_sys import Collection_book, User_likes, Book, Book_author, Book_genre, Genre, Review, Author
from bookstation.models.user_sys import User, Collection
from bookstation.models.event_sys import User_badge
from bookstation import app, request, db, error
from bookstation.utils.auth_util import get_user

from flask import session

import hashlib
import jwt




@app.route("/book/details", methods=["GET"])
def getDetails():
    '''
    Get book details
    Args (GET):
        bookId (integer): request bookId
        sort (string): can be 'time', 'likes', 'badges'
    Returns:
        json object of book details
    Raises:
        InputError: no book has been found for book_id
    '''
    #get input
    token = request.args.get('token') 
    sort = request.args.get('sort')
    if token != None:
        user = get_user(token)
    book_id = request.args.get('bookId')
    page_no = int(request.args.get('page'))
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
            is_liked = False
            if token != None:
                if User_likes.query.filter_by(user_id = user.user_id, review_id = review.review_id).first() != None:
                    is_liked = True
                if review.user_id == user.user_id:
                    continue
            badges = []
            user_badges = User_badge.query.filter_by(user_id = review.user_id).all()
            for user_badge in user_badges:
                badge = user_badge.badge
                badges.append({'badge_id' : badge.badge_id, 'image' : badge.image})
            reviews.append({'review_id': review.review_id, 'avatar': review.user.avatar, 'user_id': review.user_id, 'username': review.user.username, 'avatar' : review.user.avatar, 'badges' : badges,'rating': review.rating, 'content': review.content, 'time': str(review.created_time), 'likes' : review.likes, 'is_liked' : is_liked})
                
    
    if sort == 'badges':
        reviews.sort(key = lambda x: len(x[sort]), reverse=True)
    else:
        reviews.sort(key = lambda x: x[sort], reverse=True)
    reviews = reviews[5*(page_no-1): 5*page_no]
    review_pageno = math.ceil(len(reviews)/5)
    book_dict['reviews'] = reviews
    book_dict['pages'] = review_pageno


    return dumps(book_dict)


@app.route("/book/ownreview", methods=["GET"])
def ownReview():
    token = request.args.get('token') 
    book_id = request.args.get('bookId')
    user = get_user(token)
    review = Review.query.filter_by(user_id = user.user_id, book_id = book_id).first()
    review_dict = []
    if review != None:
        is_liked = False
        if User_likes.query.filter_by(user_id = user.user_id, review_id = review.review_id).first() != None:
            is_liked = True
        user_badges = User_badge.query.filter_by(user_id = user.user_id).all()
        badges = []
        for user_badge in user_badges:
            badge = user_badge.badge
            badges.append({'badge_id' : badge.badge_id, 'image' : badge.image})
        review_dict.append({'review_id': review.review_id, 'avatar': review.user.avatar, 'user_id': review.user_id, 'username': review.user.username,'badges':badges, 'avatar' : review.user.avatar,'rating': review.rating, 'content': review.content, 'time': str(review.created_time), 'likes' : review.likes, 'is_liked' : is_liked})
    return dumps({'review' : review_dict})

@app.route("/book/likereview", methods=["POST"])
def likeReview():

    """
    Arg: review_id to like
    
    """
    body = request.get_json()
    user = get_user(body['token'])
    review_id = body['review_id']
    if User_likes.query.filter_by(user_id = user.user_id, review_id = review_id).first() != None:
        raise error.BadReqError(description="User already liked this cannot like twice")
    
    user_like = User_likes(user_id = user.user_id, review_id = review_id)
    review = Review.query.get(review_id)
    review.likes = review.likes + 1
    db.session.add(user_like)
    db.session.commit()

    return dumps({})


@app.route("/book/editreview", methods=["POST"])
def editReview():

    """
    Arg: review_id to like
    review: new content of review
    
    """
    body = request.get_json()
    print(body)
    user = get_user(body['token'])

    review_id = body['review_id']
    review_content = body['review']

    review = Review.query.get(review_id)

    if review.user_id != user.user_id:
        raise error.AccessError(description="No right to edit this review")
    review.content = review_content
    db.session.add(review)
    db.session.commit()

    return dumps({})



@app.route("/book/unlikereview", methods=["POST"])
def unlikeReview():
    """
    Arg: review_id to unlike
    
    """
    body = request.get_json()
    user = get_user(body['token'])
    review_id = body['review_id']
    user_like = User_likes.query.filter_by(user_id = user.user_id, review_id = review_id).first()
    if user_like == None:
        raise error.BadReqError(description="user never liked this review")

    review = Review.query.get(review_id)
    review.likes = review.likes - 1
    db.session.delete(user_like)
    db.session.commit()

    return dumps({})




@app.route("/book/similarbooks", methods=["GET"])
def similarBooks():

    """
    Arg: book_id of book to get simialr books from

    Returns: list of book objects that are similar to target book
    
    """
    book_id = request.args.get('book_id')
    target_tags = set()
    similarity_set = set()
    genres = Book_genre.query.filter_by(book_id = book_id).all()

    for genre in genres:
        target_tags.add(genre.genre_id)


    authors = Book_author.query.filter_by(book_id = book_id).all()
    for author in authors:
        author_books = Book_author.query.filter_by(author_id = author.author_id).all()
        for book in author_books:
            if book.book_id == book_id:
                continue
            comptags = set()
            compgenres = Book_genre.query.filter_by(book_id = book.book_id).all()
            for compgenre in compgenres:
                comptags.add(compgenre.genre_id)
            similarity = len(target_tags.intersection(comptags))
            similarity_set.add((book.book_id, similarity))
            
    book_list = sorted(similarity_set, key = lambda x: x[1])
    if len(book_list) == 0:
        no_similar_list = []
        books = Book.query.order_by(Book.average_rating.desc()).limit(3).all()
        for book in books:
            no_similar_dict = {'title' : book.title, 'cover_image' : book.cover_image, 'id': book.book_id}
            no_similar_list.append(no_similar_dict)
        return dumps({'books' : no_similar_list})

    return_list = []
    i = 0
    for book_tup in book_list:
        book = Book.query.get(book_tup[0])
        if book.cover_image != "":
            return_dict = {'title' : book.title, 'cover_image' : book.cover_image, 'id': book.book_id}
            return_list.append(return_dict)
            i += 1
            if i > 3:
                break
    

    return dumps({'books' : return_list})



#get reviews for a user_id doesnt seem to be used
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
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = None, created_time = datetime.now(), likes=0)
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

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
        db.session.flush()
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection == None:
        new_book_collection = Collection_book(collection.collection_id, book_id, datetime.now())
        db.session.add(new_book_collection)
        db.session.commit()

    return dumps({"success": True})


#add comment and rating
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
    new_review_id = 0
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
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = content, created_time = datetime.now(), likes=0)
        #post to databse
        book.average_rating = (book.num_rating * book.average_rating+new_rating)/(book.num_rating + 1)
        book.num_rating = book.num_rating + 1
        db.session.add(book)
        db.session.add(review)
        db.session.commit()
        db.session.flush()
        new_review_id = review.review_id
    else:
        book.average_rating = (book.num_rating * book.average_rating+new_rating-review.rating)/(book.num_rating)
        db.session.add(book)
        review.rating = new_rating
        review.content = content
        review.created_time = datetime.now()
        db.session.add(review)
        db.session.commit()
        db.session.flush()
        new_review_id = review.review_id

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
        db.session.flush()
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection == None:
        new_book_collection = Collection_book(collection.collection_id, book_id, datetime.now())
        db.session.add(new_book_collection)

    new_content = "Added a review for " + "< " + book.title + " > " + ": " + content
    newPost = Post(user_id=user.user_id, content= new_content, created_time= datetime.now())
    db.session.add(newPost)
    db.session.commit()
   
    return dumps({"review_id": new_review_id})





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
    user = get_user(token)
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
