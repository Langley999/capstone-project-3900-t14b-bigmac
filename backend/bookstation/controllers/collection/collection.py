from json import dumps
from bookstation.models.book_sys import Saved_collection
from bookstation import app, request, db, error
from bookstation.models.user_sys import User, Collection
from bookstation.utils.auth_util import get_user
from bookstation.models.book_sys import Collection_book


from datetime import datetime
url_prefix = "/collection"


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
@app.route(url_prefix + '/getall', methods=["GET"])
def get_all_collections():

	user_id = request.args.get('user_id')
	collections = Collection.query.filter_by(user_id = user_id).all()
	if len(collections) == 0:
		new_default_collection = Collection(1, "Favourite", datetime.now(), user_id)
		new_history_collection = Collection(2, "Reading History", datetime.now(), user_id)
		db.session.add(new_default_collection)
		db.session.add(new_history_collection)
		db.session.commit()
	collections = Collection.query.filter_by(user_id = user_id).all()
	collection_info = []
	for collection in collections:
		new = {
			'id': collection.collection_id,
			'name': collection.name,
			'flag': collection.is_default
		}
		collection_info.append(new)

	if (collections == None):
		raise error.NotFoundError(description="Invalid Collection Name")
	return dumps({
		"collections": collection_info
	})

"""
Function for users to to create a new collection.
Args:
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
@app.route(url_prefix + '/create', methods=["POST"])
def create_collection():

	try:
		data = request.get_json()
		collection_name, token = data['name'], data['token']
	except:
		raise error.BadReqError(description="post body error")

	user = get_user(token)

	try:
		new_default_collection = Collection(0, collection_name, datetime.now(), user.user_id)
		db.session.add(new_default_collection)
		db.session.commit()
	except:
		raise error.BadReqError(description="Creation failed")
	return dumps({
		"id": new_default_collection.collection_id
	})

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
@app.route(url_prefix + '/getcollection', methods=["GET"])
def get_collection():

	target_collection_id = request.args.get('collection_id')
	token = request.args.get('token')
	user = get_user(token)
	find = Saved_collection.query.filter_by(user_id = user.user_id,collection_id=target_collection_id).all()
	try:
		collection = Collection.query.get(target_collection_id)
		collection_books = Collection_book.query.filter_by(collection_id=target_collection_id)
		booklist = []
		for collection_book in collection_books:
			book = collection_book.book
			new = {
				'id': book.book_id,
				'title': book.title,
				'cover': book.cover_image
			}
			booklist.append(new)

		return dumps({
			"books": booklist,
			"name": collection.name,
			"has_saved": find != []
		})
	except:
		raise error.NotFoundError(description="Cannot get the collection")

"""
Function for users to to add a book to a collection
Args:
	token (string): token of the user
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
@app.route(url_prefix + '/addbook', methods=["POST"])
def add_book():

	try:
		data = request.get_json()
		token, c_id, b_id = data['token'], data['collection_id'], data['book_id']
	except:
		raise error.BadReqError(description="post body error")

	user = get_user(token)
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

"""
Function for users to to remove a book in a collection
Args:
	token (string): token of the user
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
@app.route(url_prefix + '/removebook', methods=["DELETE"])
def remove_book():
	try:
		data = request.get_json()
		token, c_id, b_id = data['token'], data['collection_id'], data['book_id']
	except:
		raise error.BadReqError(description="post body error")

	user = get_user(token)
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

"""
Function for users to to remove a collection
Args:
	token (string): token of the user
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
@app.route(url_prefix + '/removecollection', methods=["DELETE"])
def remove_collection():
	try:
		data = request.get_json()
		token, c_id = data['token'], data['collection_id']
	except:
		raise error.BadReqError(description="post body error")

	user = get_user(token)
	collection = Collection.query.filter_by(collection_id = c_id).first()
	if collection == None:
		raise error.NotFoundError(description="Collection does not exist")
	if collection.user_id != user.user_id:
		raise error.AccessError(description="You don't have permission to add this book")
	try:
		Collection_book.query.filter_by(collection_id = c_id).delete()
		saved_collections = Saved_collection.query.filter_by(collection_id = c_id).all()
		for saved in saved_collections:
			db.session.delete(saved)
		db.session.delete(collection)
		db.session.commit()

		return dumps({
			"success": []
		})
	except:
		raise error.BadReqError(description="Cannot remove collection")

"""
Save a given collection for the current user
Args:
	token (string): used for user session validation
	collection_id (int): id of the collection to be saved
Raises:
	BadReqError: User has already saved the specified collection.
"""
@app.route(url_prefix + '/savecollection', methods=["POST"])
def save_collections():
	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']

	if Saved_collection.query.filter_by(user_id = user.user_id, collection_id = collection_id).first() != None:
		raise error.BadReqError(description="User already saved collection")
	save = Saved_collection(user_id = user.user_id, collection_id = collection_id)
	db.session.add(save)
	db.session.commit()

	return dumps({})

"""
Unsave a given collection for the current user
Args:
	token (string): used for user session validation
	collection_id (int): id of the collection to be unsaved
Raises:
	BadReqError: User never saved the specified collection.
"""
@app.route(url_prefix + '/unsavecollection', methods=["POST"])
def unsave_collections():

	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']
	save = Saved_collection.query.filter_by(user_id = user.user_id, collection_id = collection_id).first()
	if save == None:
		raise error.BadReqError(description="User never saved this collection")

	db.session.delete(save)
	db.session.commit()

	return dumps({})

"""
Get the saved collections for a specified user 
Args:
    user_id (integer): user id of the user to retrieve collections for

Returns:
    collections (list): list of collection objects 
		- collection_id (integer): id of the colleciton
		- collection_name (string): name of the collection
		- is_default (integer): flag to indicate status of collection
		- created_time (datetime): time of creation of collection
		- user_id (integer): id of the user whom colleciton is owned by
		- username (string): usename of the user whom collection is owned by
"""
@app.route(url_prefix + '/savedcollections', methods=["GET"])
def get_savedCollections():

	user_id = request.args.get('user_id')

	collections = Saved_collection.query.filter_by(user_id = user_id).all()
	collection_list = []
	for collection in collections:
		if collection.collection != None:
			collection_dict = {'collection_id' : collection.collection_id, 'name' : collection.collection.name, 'is_default' : collection.collection.is_default, 'created_time' : str(collection.collection.created_time), 'user_id' : collection.collection.user.user_id, 'username' : collection.collection.user.username}
		collection_list.append(collection_dict)


	return dumps({'collections' : collection_list})


"""
Rename specified collection 
Args:
	token (string): used for user session validation
	collection_id (integer): id of the collection to be renamed
	name (string): new name to change collection's name to 

Raises:
	BadReqError: Collection does not exist
	AccessError: User does not own the collection to be renamed
"""
@app.route(url_prefix + '/rename', methods=["POST"])
def rename_collection():
	body = request.get_json()
	user = get_user(body['token'])
	collection_id = body['collection_id']
	new_name = body['name']

	collection = Collection.query.get(collection_id)
	if collection == None:
		raise error.BadReqError(description="Collection does not exist")
	if collection.user_id != user.user_id:
		raise error.AccessError(description="user does not own collection")

	collection.name = new_name
	db.session.commit()
	return dumps({})

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
@app.route(url_prefix + '/recentbooks', methods=["GET"])
def recent_books():

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
			dic = {
				'time': cbook.created_time,
				'book': cbook.book
			}
			all_books.append(dic)

	newlist = sorted(all_books, key=lambda d: d['time'],reverse=True)
	res = []
	for n in newlist:
		bookinfo = {
			'id': n['book'].book_id,
			'title': n['book'].title,
			'cover': n['book'].cover_image,
			'added_time': str(n['time'])
		}
		if len([x['id'] for x in res if x['id'] == bookinfo['id']]) == 0:
			res.append(bookinfo)
			if len(res) == 10:
				break

	return dumps({
		"books": res
	})







