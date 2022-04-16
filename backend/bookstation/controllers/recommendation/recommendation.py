from json import dumps
import ast
from bookstation import app, request
from bookstation.models.book_sys import *
from bookstation.models.user_sys import Collection, Follow_relationship
from sqlalchemy import desc
from bookstation.utils.auth_util import get_user

url_prefix = '/recommendation'
"""
Function to get top 20 best rating books
Args:
Returns:
	books (list): list of all books from the search
		- id (int): book id
		- title (string): title of the book
		- cover (string): url of the cover image
		- author (string): author of the book
		- num_rating (int): number of people who rated this book
		- average_rating (float): the rating of the book
		- publish_date (string): the publish date of the book
"""
@app.route(url_prefix + "/toprating", methods=["GET"])
def toprating():

	results = []
	books = Book.query.order_by(desc(Book.average_rating)).all()
	for book in books[0:20]:
		book_info = {}
		book_info['id'] = book.book_id
		book_info['title'] = book.title
		book_info['author'] = book.author_string
		book_info['num_rating'] = book.num_rating
		book_info['cover'] = book.cover_image
		book_info['average_rating'] = book.average_rating
		book_info['publish_date'] = book.publish_date
		results.append(book_info)
			
	return dumps({
		"books": results
	})



"""
Description: 
	- Get recommendation based on user activity in particular the most most frequent Genre

Args:
	token (string): to be used for session validation

Return:
	favourite_genres (list): list containing of names of most popular Genres
"""		
@app.route(url_prefix + "/favouriteGenre", methods=["GET"])
def favouriteGenre():
	token = request.args.get('token')
	user = get_user(token)

	# get all books from all collections the current user has created
	# add its book_id and genre to the set, set strucutre prevents duplication
	book_set = set()
	collections = Collection.query.filter_by(user_id = user.user_id).all()
	for collection in collections:
		books = Collection_book.query.filter_by(collection_id = collection.collection_id).all()
		for collection_book in books:
			book = collection_book.book
			if (book.book_id, book.genre_string) not in book_set:
				book_set.add((book.book_id, book.genre_string))
	
	#create genre frequency mapping
	genre_freq = {}
	for (book_id, genres) in book_set:
		genres_list = ast.literal_eval(genres)
		for genre in genres_list:
			if genre in genre_freq:
				genre_freq[genre] += 1
			else:
				genre_freq[genre] = 1
	
	max_genres = [keys for keys, values in genre_freq.items() if values == max(genre_freq.values())]
	return dumps({'favourite_genres' : max_genres})
		
"""
Description: 
	- Get recommendation based on user activity in particular the most most frequent Author's books

Args:
	- token (string): to be used for session validation

Return:
	favourite_authors (list): list containing names of favourite authors
	books (list): list of book objects from those authors
		- book_id (integer): id of the book
		- title (string): title of the book
		- rating (integer): average rating of the book

"""		
@app.route(url_prefix + "/favouriteAuthor", methods=["GET"])
def favouriteAuthor():
	token = request.args.get('token')
	user = get_user(token)

	# get all books from all collection the current user has created
	# add its book_id and corresponding author to book set, set strucutre prevents duplication
	book_set = set()
	collections = Collection.query.filter_by(user_id = user.user_id).all()
	for collection in collections:
		books = Collection_book.query.filter_by(collection_id = collection.collection_id).all()
		for collection_book in books:
			book = collection_book.book
			if (book.book_id, book.author_string) not in book_set:
				book_set.add((book.book_id, book.author_string))
	
	# create frequency mapping for Authors
	author_freq = {}
	for (book_id, authors) in book_set:
		# note: it is quicker to use pythons processing, than to query a m-m relationship table
		authors_list = authors.split(", ")
		for author in authors_list:
			if author in author_freq:
				author_freq[author] += 1
			else:
				author_freq[author] = 1
	
	#sort this mapping so that we retrieve the most frequent author(s) 
	max_authors = [keys for keys, values in author_freq.items() if values == max(author_freq.values())]
	author_book_set = set()
	books_list = []

	# retrieve all books from most frequent author(s)
	# there maybe multiple authors sharing the max frequency
	for author_name in max_authors:
		author = Author.query.filter_by(name = author_name).first()
		books = Book_author.query.filter_by(author_id = author.author_id).all()
		for book_author in books:
			book = book_author.book
			book_dict = {
				'book_id': book.book_id, 
				'title' : book.title, 
				'rating' : book.average_rating }
			if book.book_id not in author_book_set:
				books_list.append(book_dict)
				author_book_set.add(book.book_id)

	books_list.sort(key = lambda x: x['rating'], reverse=True)
	return dumps({'favourite_authors' : max_authors, 'books' : books_list})


"""
Description: 
	- Get recommendation based the users the current user follows

Args:
	token (string): to be used for session validation

Return:
	favourite_followed_book (list): list Favourite book objects from followings of user

"""	
@app.route(url_prefix + "/favouriteFollowed", methods=["GET"])
def favouriteFollowed():
	token = request.args.get('token')
	user = get_user(token)

	followed_users = Follow_relationship.query.filter_by(follower_user_id = user.user_id).all()
	book_set = set()
	books_list = []

	#get all books from all collections from all users the current user follows
	for user in followed_users:
		collections = Collection.query.filter_by(user_id = user.followed_user.user_id)
		for collection in collections:
			books = Collection_book.query.filter_by(collection_id = collection.collection_id)
			for collection_book in books:
				book = collection_book.book
				book_dict = {
				    'book_id' : book.book_id,
				    'title' : book.title,
				    'author': book.author_string,
		            'num_rating': book.num_rating,
		            'cover': book.cover_image,
				    'average_rating' : book.average_rating,
				    'publish_date': book.publish_date
                }
				#the set is maintained only for O(1) checkup of the book dict
				if book.book_id not in book_set:
					books_list.append(book_dict)
					book_set.add(book.book_id)

	
	books_list.sort(key = lambda x: x['average_rating'], reverse=True)
	return dumps({'favourite_followed_books' : books_list})