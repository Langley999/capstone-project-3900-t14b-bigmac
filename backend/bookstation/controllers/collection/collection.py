from json import dumps
import time
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection, Collection_book
from flask import session
from config import SECRET
import hashlib
import jwt
from datetime import datetime
url_prefix = "/collection"

@app.route(url_prefix + '/getall', methods=["GET"])
def get_all_collections():

    user_name = request.args.get('user')
    
    token = request.args.get('token')
    user = User.query.filter_by(username = user_name).first()
    # sql select user
    collections = user.collections
    if len(collections) == 0:
      new_default_collection = Collection(1, "Favourate", datetime.now(), user.user_id) 
      new_history_collection = Collection(2, "Reading History", datetime.now(), user.user_id)
      db.session.add(new_default_collection)
      db.session.add(new_history_collection)
      db.session.commit()
    collections = user.collections
    collection_info = []
    for collection in collections:
      new = {}
      new['id'] = collection.collection_id
      new['name'] = collection.name
      new['flag'] = collection.is_default
      collection_info.append(new)

    if (collections == None):
        raise error.NotFoundError(description="Invalid Collection Name")
    return dumps({
        "collections": collection_info
    })

@app.route(url_prefix + '/create', methods=["POST"])
def create_collection():

    user_name = request.args.get('user')
    collection_name = request.args.get('name')
    token = request.args.get('token')
    user = User.query.filter_by(username = user_name).first()
    # sql select user
    
    new_default_collection = Collection(0, collection_name, datetime.now(), user.user_id) 
    db.session.add(new_default_collection)
    db.session.commit()

    return dumps({
        "success":[]
    })

@app.route(url_prefix + '/getcollection', methods=["GET"])
def get_collection():

    user_name = request.args.get('user')
    id = request.args.get('collection_id')
    user = User.query.filter_by(username = user_name).first()
    # sql select user
    collection = Collection.query.filter_by(collection_id = id).first()
    books = collection.books
    booklist = []
    for book in books:
      new = {}
      new['id'] = book.book_id
      new['title'] = book.title
      new['cover'] = book.cover_image
      booklist.append(new)

    return dumps({
        "books": booklist
    })

@app.route(url_prefix + '/addbook', methods=["POST"])
def add_book():

    user_name = request.args.get('user')
    c_id = request.args.get('collection_id')
    b_id = request.args.get('book_id')
    user = User.query.filter_by(username = user_name).first()
    collection = Collection.query.filter_by(collection_id = id).first()
    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to add this book")

    user = User.query.filter_by(username = user_name).first()
    new_book_collection = Collection_book(c_id, b_id, datetime.now()) 
    db.session.add(new_book_collection)
    db.session.commit()

    return dumps({
        "success": []
    })

@app.route(url_prefix + '/removebook', methods=["DELETE"])
def remove_book():

    user_name = request.args.get('user')
    c_id = request.args.get('collection_id')
    b_id = request.args.get('book_id')
    user = User.query.filter_by(username = user_name).first()
    collection = Collection.query.filter_by(collection_id = id).first()
    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to add this book")

    book_collection = Collection_book.query.filter_by(collection_id = c_id, book_id = b_id)
    if book_collection == None:
      raise error.AccessError(description="This book doesn't exist in the collection")

    db.session.delete(book_collection)
    db.session.commit()

    return dumps({
        "success": []
    })

@app.route(url_prefix + '/removecollection', methods=["DELETE"])
def remove_collection():

    user_name = request.args.get('user')
    c_id = request.args.get('collection_id')

    user = User.query.filter_by(username = user_name).first()
    collection = Collection.query.filter_by(collection_id = c_id).first()
    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to add this book")


    db.session.delete(collection)
    db.session.commit()

    return dumps({
        "success": []
    })




