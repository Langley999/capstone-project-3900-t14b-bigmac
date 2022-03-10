from json import dumps
import time
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection
from bookstation.models.book_sys import Collection_book
from flask import session
from config import SECRET
import hashlib
import jwt
from datetime import datetime
url_prefix = "/collection"

@app.route(url_prefix + '/getall', methods=["GET"])
def get_all_collections():
    """
    Function for users to to get one user's all collection details. 

    Args:
        user (string): username of the requester.

    Returns:
        collections (list): list of all collections
           - id (int): collection id
           - name (string): name of the collection
           - flag (int): flag indicator of the type of collection: 1 = default favourate, 2 = default history, 3 = customised collection

    Raises:
        NotFoundError: when the collection with the name does not exist
    """
    user_name = request.args.get('user')
    user = User.query.filter_by(username = user_name).first()
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
    """
    Function for users to to create a new collection. 

    Args:
        email (string): email of the requester.
        name (string): name of the new collection
        token (string): token of the requester
    Returns:
        collections (list): list of all collections
           - id (int): collection id
           - name (string): name of the collection
           - flag (int): flag indicator of the type of collection: 1 = default favourate, 2 = default history, 3 = customised collection

    Raises:
        BadReqError: when the collection creation fails
        AccessError: 
          - when the user does not have permission to create collection
          - when the user does not exist
    """
    email = request.args.get('email')
    collection_name = request.args.get('name')
    token = request.args.get('token')
    try:
        stored_token = session.get(email)
        if stored_token != token:
          raise error.AccessError(description="You don't have permission to create collection")
    except:
        raise error.AccessError(description="user doesn't exist")
    user = User.query.filter_by(email = email).first()
    try:
      new_default_collection = Collection(0, collection_name, datetime.now(), user.user_id) 
      db.session.add(new_default_collection)
      db.session.commit()
    except:
        raise error.BadReqError(description="Creation failed")
    return dumps({
        "success":[]
    })

@app.route(url_prefix + '/getcollection', methods=["GET"])
def get_collection():
    """
    Function for users to to get details of a collection. 

    Args:
        collection_id (string): id of the collection 

    Returns:
        books (list): list of all books within the collection
           - id (int): book id
           - title (string): title of the book
           - cover (string): url of the cover image

    Raises:
        NotFoundError: when the collection creation fails
        AccessError: 
          - when the user does not have permission to create collection
          - when the user does not exist
    """
    # user_name = request.args.get('user')
    id = request.args.get('collection_id')
    try: 
      collection = Collection.query.get(id)
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
    except:
      raise error.NotFoundError(description="Cannot get the collection")

@app.route(url_prefix + '/addbook', methods=["POST"])
def add_book():
    """
    Function for users to to add a book to a collection

    Args:
        email (string): email of the user
        collection_id (int): id of the collection
        book_id (int): id of the book

    Returns:
        success message

    Raises:
        NotFoundError: when the collection does not exist
        AccessError: 
          - when the user does not have permission to add book to this collection
        BadReqError:
          - when adding book fails
    """
    email = request.args.get('email')
    c_id = request.args.get('collection_id')
    b_id = request.args.get('book_id')
    user = User.query.filter_by(email = email).first()
    collection = Collection.query.filter_by(collection_id = id).first()
    if collection == None:
      raise error.NotFoundError(description="Collection does not exist")

    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to add this book")
    try:
      new_book_collection = Collection_book(c_id, b_id, datetime.now()) 
      db.session.add(new_book_collection)
      db.session.commit()

      return dumps({
          "success": []
      })
    except:
      raise error.BadReqError(description="Cannot add the book to this collection")


@app.route(url_prefix + '/removebook', methods=["DELETE"])
def remove_book():
    """
    Function for users to to remove a book in a collection

    Args:
        email (string): email of the user
        collection_id (int): id of the collection
        book_id (int): id of the book

    Returns:
        success message

    Raises:
        NotFoundError: when the book does not exist in the collection
        AccessError: 
          - when the user does not have permission to remove book 
        BadReqError:
          - when removing book fails
    """
    email = request.args.get('email')
    c_id = request.args.get('collection_id')
    b_id = request.args.get('book_id')
    user = User.query.filter_by(email = email).first()
    collection = Collection.query.filter_by(collection_id = id).first()
    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to remove this book")

    book_collection = Collection_book.query.filter_by(collection_id = c_id, book_id = b_id)
    if book_collection == None:
      raise error.NotFoundError(description="This book doesn't exist in the collection")
    try:
      db.session.delete(book_collection)
      db.session.commit()

      return dumps({
          "success": []
      })
    except:
      raise error.BadReqError(description="Cannot remove book ")

@app.route(url_prefix + '/removecollection', methods=["DELETE"])
def remove_collection():
    """
    Function for users to to remove a collection

    Args:
        email (string): email of the user
        collection_id (int): id of the collection
        book_id (int): id of the book

    Returns:
        success message

    Raises:
        NotFoundError: when the collection does not exist
        AccessError: 
          - when the user does not have permission to remove this collection
        BadReqError:
          - when removing collection fails
    """
    email = request.args.get('email')
    c_id = request.args.get('collection_id')

    user = User.query.filter_by(email = email).first()
    collection = Collection.query.filter_by(collection_id = c_id).first()
    if collection == None:
      raise error.NotFoundError(description="Collection does not exist")
    if collection.user_id != user.user_id:
      raise error.AccessError(description="You don't have permission to add this book")
    try:
      db.session.delete(collection)
      db.session.commit()

      return dumps({
          "success": []
      })
    except:
      raise error.BadReqError(description="Cannot remove collection")




