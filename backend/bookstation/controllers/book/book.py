from datetime import datetime
from json import dumps
import ast
import math

from bookstation.models.user_sys import Follow_relationship, Notification
from bookstation.models.user_sys import Post
from bookstation.models.book_sys import Collection_book, User_likes, Book, Book_author, Book_genre,  Review
from bookstation.models.user_sys import Collection
from bookstation.models.event_sys import User_badge
from bookstation import app, request, db, error
from bookstation.utils.auth_util import get_user

'''

Retrieve all book details relevant infromation

Args (GET):
    token (string) (optional): used for user session validation
    bookId (integer): request bookId
    sort (string): can be 'time', 'likes', 'badges'

Returns:
    book_dict: Dictionary of book objecsts
        - relevant book fields
        - reviews (list): list of all reviews associated with particualr book

Raises:
    InputError: no book has been found for book_id
'''
@app.route("/book/details", methods=["GET"])
def getDetails():

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



"""
Get the total number of people who've read a particular book
Args:
    book_id (integer): id of the book

Returns
    num_reads (integer): number of users that read book
"""
@app.route("/book/numreads", methods=["GET"])
def numReads():

    book_id = int(request.args.get('bookId'))
    num_reads = 0

    #retrieve all history collections
    collections = Collection.query.filter_by(is_default = 2).all()
    for collection in collections:
        exists = len(Collection_book.query.filter_by(book_id = book_id, collection_id = collection.collection_id).all())
        if exists == 1:
            num_reads += 1

    return dumps({'num_reads':  num_reads})



"""
Retrieve the current users review for a particular book
Args:
    token (string) : used for user session validation
	book_id (integer): id of the book

Returns:
    review (dict): Dictionary containing review relevant information

"""
@app.route("/book/ownreview", methods=["GET"])
def ownReview():
    token = request.args.get('token') 
    book_id = request.args.get('bookId')
    user = get_user(token)

    review = Review.query.filter_by(user_id = user.user_id, book_id = book_id).first()
    review_dict = []
    if review != None and review.content != None:
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



"""
Create a like for specified book
Args:
    token (string) : used for user session validation
	review_id (integer): id of the review to like

Raises:
    BadReqError: User already liked the specified review

"""
@app.route("/book/likereview", methods=["POST"])
def likeReview():

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

    body = request.get_json()
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


"""
Remove a like for specified book
Args:
    token (string) : used for user session validation
	review_id (integer): id of the review to unlike

Raises:
    BadReqError: User never liked the specified review

"""
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



"""
Algorithm to find the most similar books to a given book

Args:
	book_id (integer): id of book to compare to

Returns:
    return_list (list): List of book objects
        - id (integer): id of book
        - title (string): title of book
        - cover_image (string): cover image of book
"""
@app.route("/book/similarbooks", methods=["GET"])
def similarBooks():

    book_id = int(request.args.get('book_id'))

    #get all genres for the specified book and create genre set for comparison
    target_tags = set()
    similarity_set = set()
    genres = Book_genre.query.filter_by(book_id = book_id).all()
    for genre in genres:
        target_tags.add(genre.genre_id)

    # get all books from author(s) of the specified book 
    # quanitfy similarity value based on interesction length with genre tags
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

    #handling cases where author does not have many other books
    #return best rated books instead
    book_list = sorted(similarity_set, key = lambda x: x[1])
    if len(book_list) == 0:
        no_similar_list = []
        books = Book.query.order_by(Book.average_rating.desc()).limit(3).all()
        for book in books:
            if book.book_id == book_id:
                continue
            no_similar_dict = {'title' : book.title, 'cover_image' : book.cover_image, 'id': book.book_id}
            no_similar_list.append(no_similar_dict)
        return dumps({'books' : no_similar_list[:5]})
    
    return_list = []
    for book_tup in book_list:
        book = Book.query.get(book_tup[0])
        return_dict = {'title' : book.title, 'cover_image' : book.cover_image, 'id': book.book_id}
        return_list.append(return_dict)

    return dumps({'books' : return_list[:5]})



'''
Get reviews for a user given a book
Args (GET):
    token: token of the operator
    bookId (integer): book_id of user requesting reviews
Returns:
    json object of user reviews
'''
@app.route("/book/reviews", methods=["GET"])
def getReview():
    #get input
    token = request.args.get('token')
    book_id = request.args.get('bookId')
    user = get_user(token)
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
@app.route("/book/ratings", methods=["POST"])
def addRating():

    #get body
    body = request.get_json()
    #extract information
    book_id = body['book_id']
    token = body['token']
    user = get_user(token)
    new_rating = body['rating']

    review = Review.query.filter_by(book_id = book_id, user_id = user.user_id).first()
    book = Book.query.get(book_id)

    if review == None:
        #create record
        review = Review(book_id = book_id, user_id = user.user_id, rating = new_rating, content = None, created_time = datetime.now(), likes=0)
        #post to database
        book.average_rating = (book.num_rating * book.average_rating+new_rating)/(book.num_rating + 1)
        book.num_rating = book.num_rating + 1
        db.session.add(book)
    else:
        book.average_rating = (book.num_rating * book.average_rating+new_rating-review.rating)/(book.num_rating)
        db.session.add(book)
        review.rating = new_rating
        review.created_time = datetime.now()
    db.session.add(review)

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection == None:
        new_book_collection = Collection_book(collection.collection_id, book_id, datetime.now())
        db.session.add(new_book_collection)
    db.session.commit()

    return dumps({"success": True})


'''
Add rating and review
Args (POST):
    book_id (integer): bookId of book being dded
    token (string): token of user who's adding
    rating (integer): rating value
    created_time (string): time of review creation
    review (string): content of review
Returns:
    none
'''
@app.route("/book/ratings_reviews", methods=["POST"])
def addRatingReview():

    #get body
    body = request.get_json()
    new_review_id = 0
    #extract information
    book_id = body['book_id']
    token = body['token']
    user = get_user(token)
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
    else:
        book.average_rating = (book.num_rating * book.average_rating+new_rating-review.rating)/(book.num_rating)
        review.rating = new_rating
        review.content = content
        review.created_time = datetime.now()
    db.session.add(book)
    db.session.add(review)
    db.session.commit()
    new_review_id = review.review_id

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection == None:
        new_book_collection = Collection_book(collection.collection_id, book_id, datetime.now())
        db.session.add(new_book_collection)

    new_content = "Added a review for " + "< " + book.title + " > " + ": " + content
    newPost = Post(user_id=user.user_id, content= new_content, created_time= datetime.now())

    # add notification for followers
    followers = Follow_relationship.query.filter_by(user_id = user.user_id).all()
    for follower in followers:
        newnotif = Notification(user_id=follower.follower_user_id, type='review', type_id = book_id, time= datetime.now(), sender_id=user.user_id)
        db.session.add(newnotif)
    db.session.add(newPost)
    db.session.commit()
   
    return dumps({"review_id": new_review_id})




'''
Mark a book as completed
Args (POST):
    book_id (integer): book being marked
    token (string): token of the operator
Returns:
    None
Raises:
    BadReqError: post body error
    BadReqError: Cannot add the book to this collection
    BadReqError: This book has already been added to the collection

'''

@app.route("/book/completereading", methods=["POST"])
def completeReading():
    try:
        data = request.get_json()
        token, book_id = data['token'], data['book_id']
    except:
        raise error.BadReqError(description="post body error")

    user = get_user(token)

    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
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


'''
Check if a book is completed by user
Args (GET):
    book_id (integer): bookId of book being checked
    token (string): token of the operator
Returns:
    flag: whether user has completed
'''
@app.route("/book/check_completed", methods=["GET"])
def checkCompleted():
    #extract information
    token = request.args.get('token')
    book_id = request.args.get('bookId')
    user = get_user(token)
    collection = Collection.query.filter_by(name='Reading History', user_id=user.user_id).first()
    if collection == None:
        new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
        db.session.add(new_history_collection)
        db.session.commit()
    book_collection = Collection_book.query.filter_by(collection_id=collection.collection_id, book_id=book_id).first()
    if book_collection != None:
        return dumps({"success": True})
    else:
        return dumps({"success": False})
