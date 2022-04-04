from json import dumps
import time

from pymysql import NULL
from bookstation.models.book_sys import Book, Saved_collection
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection
from bookstation.utils.auth_util import get_user
from bookstation.models.book_sys import Collection_book
from flask import session

import hashlib
import jwt
from datetime import datetime
url_prefix = "/collection"

@app.route(url_prefix + '/getall', methods=["GET"])
def get_all_collections():
	"""
	Function for users to to get one user's all collection details.
	Args:
			user_id (string): user_id of the user.
	Returns:
			collections (list): list of all collections
					- id (int): collection id
					- name (string): name of the collection
					- flag (int): flag indicator of the type of collection: 1 = default favourate, 2 = default history, 3 = customised collection
	Raises:
			NotFoundError: when the collection with the name does not exist
	"""
	#token = request.args.get('token')
	user_id = request.args.get('user_id')
	#user = User.query.filter_by(user_id=user_id).first()
	collections = Collection.query.filter_by(user_id = user_id).all()
	#collections = user.collections
	if len(collections) == 0:
		new_default_collection = Collection(1, "Favourite", datetime.now(), user_id)
		new_history_collection = Collection(2, "Reading History", datetime.now(), user_id)
		db.session.add(new_default_collection)
		db.session.add(new_history_collection)
		db.session.commit()
	collections = Collection.query.filter_by(user_id = user_id).all()
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
			collection id of the new collection
	Raises:
			BadReqError: when the collection creation fails
			AccessError:
				- when the user does not have permission to create collection
				- when the user does not exist
	"""
	try:
			data = request.get_json()
			collection_name, token = data['name'], data['token']
	except:
			raise error.BadReqError(description="post body error")

	'''
	try:
			stored_token = session.get(email)
			if stored_token != token:
				raise error.AccessError(description="You don't have permission to create collection")
	except:
			raise error.AccessError(description="user doesn't exist")
	'''

	user = User.query.filter_by(token=token).first()

	try:
		new_default_collection = Collection(0, collection_name, datetime.now(), user.user_id)
		db.session.add(new_default_collection)
		db.session.commit()
		db.session.flush()
	except:
			raise error.BadReqError(description="Creation failed")
	return dumps({
			"id": new_default_collection.collection_id
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
	target_collection_id = request.args.get('collection_id')
	token = request.args.get('token')
	user = get_user(token)
	find = Saved_collection.query.filter_by(user_id = user.user_id,collection_id=target_collection_id).all()
	try:
		collection = Collection.query.get(target_collection_id)
		collection_books = Collection_book.query.filter_by(collection_id=target_collection_id)
		booklist = []
		for collection_book in collection_books:
			#book = Book.query.filter_by(book_id=collection_book.book_id)
			book = collection_book.book
			new = {}
			new['id'] = book.book_id
			new['title'] = book.title
			new['cover'] = book.cover_image
			booklist.append(new)

		return dumps({
			"books": booklist,
			"name": collection.name,
			"has_saved": find != []
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
				- book already in the collection
	"""
	try:
			data = request.get_json()
			token, c_id, b_id = data['token'], data['collection_id'], data['book_id']
	except:
			raise error.BadReqError(description="post body error")

	user = User.query.filter_by(token=token).first()
	collection = Collection.query.get(c_id)
	if collection == None:
		raise error.NotFoundError(description="Collection does not exist")

	if collection.user_id != user.user_id:
		raise error.AccessError(description="You don't have permission to add this book")
	book_collection = Collection_book.query.filter_by(collection_id=c_id, book_id=b_id).first()
	if book_collection != None:
		raise error.BadReqError(description="This book has already been added to the collection")
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
	try:
			data = request.get_json()
			token, c_id, b_id = data['token'], data['collection_id'], data['book_id']
	except:
			raise error.BadReqError(description="post body error")

	user = User.query.filter_by(token=token).first()
	collection = Collection.query.filter_by(collection_id = c_id).first()
	if collection.user_id != user.user_id:
		raise error.AccessError(description="You don't have permission to remove this book")

	book_collection = Collection_book.query.filter_by(collection_id = c_id, book_id = b_id)
	if book_collection == None:
		raise error.NotFoundError(description="This book doesn't exist in the collection")
	try:
		Collection_book.query.filter_by(collection_id = c_id, book_id = b_id).delete()
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
	Returns:
			success message
	Raises:
			NotFoundError: when the collection does not exist
			AccessError:
				- when the user does not have permission to remove this collection
			BadReqError:
				- when removing collection fails
	"""
	try:
			data = request.get_json()
			token, c_id = data['token'], data['collection_id']
	except:
			raise error.BadReqError(description="post body error")

	user = User.query.filter_by(token=token).first()
	collection = Collection.query.filter_by(collection_id = c_id).first()
	if collection == None:
		raise error.NotFoundError(description="Collection does not exist")
	if collection.user_id != user.user_id:
		raise error.AccessError(description="You don't have permission to add this book")
	try:
		Collection_book.query.filter_by(collection_id = c_id).delete()
		db.session.delete(collection)
		db.session.commit()

		return dumps({
				"success": []
		})
	except:
		raise error.BadReqError(description="Cannot remove collection")


@app.route(url_prefix + '/savecollection', methods=["POST"])
def save_collections():
	"""
	Args: collection_id : collection id to be saved
		  token			: identifies and authenticates user

	Returns: confirmation
	"""

	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']

	if Saved_collection.query.filter_by(user_id = user.user_id, collection_id = collection_id).first() != None:
		raise error.BadReqError(description="User already saved collection")
	save = Saved_collection(user_id = user.user_id, collection_id = collection_id)
	db.session.add(save)
	db.session.commit()

	return dumps({})


@app.route(url_prefix + '/unsavecollection', methods=["POST"])
def unsave_collections():
	"""
	Args: collection_id : collection id to be unsaved
		  token			: identifies and authenticates user

	Returns: confirmation
	"""

	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']
	save = Saved_collection.query.filter_by(user_id = user.user_id, collection_id = collection_id).first()
	if save == None:
		raise error.BadReqError(description="User never saved this collection")

	db.session.delete(save)
	db.session.commit()

	return dumps({})


@app.route(url_prefix + '/savedcollections', methods=["GET"])
def get_savedCollections():

	"""
	Args: token : user for which we want to find saved collections

	Returns: list of collection objects (id, name, is_default), frontend should not give add/remove books button for these collections. (even if they try backend will deny as user is not owner of the collection)

	"""

	try:
		user_id = request.args.get('user_id')
	except:
		raise error.InputError(description="not a valid user")

	collections = Saved_collection.query.filter_by(user_id = user_id).all()
	collection_list = []
	for collection in collections:
		collection_dict = {'collection_id' : collection.collection_id, 'name' : collection.collection.name, 'is_default' : collection.collection.is_default, 'created_time' : str(collection.collection.created_time), 'user_id' : collection.collection.user.user_id, 'username' : collection.collection.user.username}
		collection_list.append(collection_dict)


	return dumps({'collections' : collection_list})


# @app.route(url_prefix + '/saves', methods=["GET"])
# def get_saves():

# 	"""
# 	Args: collection_id: collection to find number of saves

# 	Returns: number of people who saved this collection

# 	"""
# 	token = request.args.get('token')
# 	user = get_user(token)
# 	collection_id = request.args.get('collection_id')
# 	saves = len(Saved_collection.query.filter_by(collection_id = collection_id).all())

# 	return dumps({'saves' : saves})


@app.route(url_prefix + '/rename', methods=["POST"])
def rename_collection():

	"""
	Args: collection_id: collection to rename
		  name		   : new name of collection

	Returns: confirmation

	"""
	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']
	new_name = body['name']

	collection = Collection.query.get(collection_id)
	if collection == None:
		raise error.BadReqError(description="Collection does not exist")
	if collection.user_id != user.user_id:
		raise error.BadReqError(description="user does not own collection")

	collection.name = new_name
	db.session.commit()
	return dumps({})


@app.route(url_prefix + '/recentbooks', methods=["GET"])
def recent_books():
	"""
	Function for users to get most recent 10 books added to collection
	Args:
			user_id (string): id of the user
	Returns:
			"recentbooks": []
					- id (int): book id
					- title (string): title of the book
					- cover (string): url of the cover image
	Raises:
			NotFoundError: when the collection does not exist
			AccessError:
				- when the user does not have permission to remove this collection
			BadReqError:
				- when removing collection fails
	"""
	try:
			u_id = request.args.get('user_id')
			token = request.args.get('token')
			user = get_user(token)
	except:
			raise error.BadReqError(description="post body error")


	collections = Collection.query.filter_by(user_id = u_id).all()
	all_books = []
	for collection in collections:
		c_id = collection.collection_id
		c_books = Collection_book.query.filter_by(collection_id = c_id).all()
		for cbook in c_books:
			dic = {}
			dic['time'] = cbook.created_time
			dic['book'] = cbook.book
			all_books.append(dic)

	newlist = sorted(all_books, key=lambda d: d['time'],reverse=True)
	res = []
	for n in newlist:
		#book = Book.query.filter_by(book_id=n['book_id'])
		bookinfo ={}
		bookinfo['id'] = n['book'].book_id
		bookinfo['title'] = n['book'].title
		bookinfo['cover'] = n['book'].cover_image
		bookinfo['added_time'] = str(n['time'])
		if len([x['id'] for x in res if x['id'] == bookinfo['id']]) == 0:
			res.append(bookinfo)
			if len(res) == 10:
				break

	return dumps({
			"books": res
	})







