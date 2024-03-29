from json import dumps
from bookstation.models.book_sys import Genre, Book_genre, Collection_book, Book_author, Author, Saved_collection
from bookstation.models.user_sys import Follow_relationship
from bookstation.utils.auth_util import get_user
from bookstation import app, request
from bookstation.models.user_sys import Collection


from datetime import datetime
url_prefix = "/analytics"
"""
Function for users to one user's fav genres 
Args:
    user_id (string): user_id of the user.
Returns:
    genres (list): list of genres and their percentages
        - genre (string): name of the genre
        - percentage (float): percentage of the genre
        
Raises:
    NotFoundError: when the collection with the name does not exist
"""
@app.route(url_prefix + '/getfavgenres', methods=["GET"])
def get_fav_genres():
    user_id = request.args.get('user_id')
    collections = Collection.query.filter_by(user_id = user_id).all()
    genrelist = {}
    bookids = []
    for collection in collections:
      cbooks = Collection_book.query.filter_by(collection_id=collection.collection_id).all()
      for cbook in cbooks:
        if cbook.book_id not in bookids:
          bookids.append(cbook.book_id)

    for bookid in bookids:
      genreids = Book_genre.query.filter_by(book_id = bookid).all()
      for id in genreids:
        genreid = id.genre_id
        genre = Genre.query.get(genreid).name
        if genre in genrelist:
          genrelist[genre] += 1
        else:
          genrelist[genre] = 1
    newlist = sorted(genrelist.items(), key=lambda x:x[1],reverse=True)
    total = 0

    for name,value in newlist:
      total += value

    result = []
    sofar = 0
    for name,value in newlist[:5]:
      item = {
        'genre': name,
        'percentage': value/total
      }
      result.append(item)
      sofar += value/total

    item = {
      'genre':'other',
      'percentage': 1 - sofar
    }
    result.append(item)
    return dumps({
        "genres": result
    })


"""
Function for users to one user's fav authors
Args:
    user_id (string): user_id of the user.
Returns:
    authors (list): list of authors and their percentages
        - author (string): name of the author
        - percentage (float): percentage of the author
        
Raises:
    NotFoundError: when the collection with the name does not exist
"""
@app.route(url_prefix + '/getfavauthors', methods=["GET"])
def get_fav_authors():
    user_id = request.args.get('user_id')
    collections = Collection.query.filter_by(user_id = user_id).all()
    authorlist = {}
    bookids = []
    for collection in collections:
      cbooks = Collection_book.query.filter_by(collection_id=collection.collection_id).all()
      for cbook in cbooks:
        if cbook.book_id not in bookids:
          bookids.append(cbook.book_id)

    for bookid in bookids:
      authorids = Book_author.query.filter_by(book_id = bookid).all()
      for id in authorids:
        authorid = id.author_id
        author = Author.query.get(authorid).name
        if author in authorlist:
          authorlist[author] += 1
        else:
          authorlist[author] = 1
    newlist = sorted(authorlist.items(), key=lambda x:x[1],reverse=True)
    total = 0
    
    for name,value in newlist:
      total += value

    result = []
    sofar = 0
    for name,value in newlist[:5]:
      item = {
        'author': name,
        'percentage': value/total
      }
      result.append(item)
      sofar += value/total

    item = {
      'author': 'other',
      'percentage': 1 - sofar
    }
    result.append(item)
    return dumps({
        "authors": result
    })


"""
Retrieve following and follower growth over 5 month interval
Args:
    user_id (integer): user id of the 
	token (string): to be used for session validation
Returns:
    Stats (list): List of follow objects
        - month (string): month of relevance
        - followings (integer): number of followings gained
		- followers (integer): number of followers gained
"""
@app.route(url_prefix + '/followstats', methods=["GET"]) 
def followStats():

    token = request.args.get('token')
    user_id = request.args.get('user_id')
    user = get_user(token)
    curr_month = datetime.now().month
    curr_year = datetime.now().year
    init_month = curr_month - 5
    init_year = curr_year
    if init_month < 1:
        init_month = 12 + init_month
        init_year = curr_year - 1
    stats = []
    for x in range(0, 6):
        if init_month > 12:
            init_month = 1
            init_year += 1

        month_dict = {'month' : init_month, 'followings' : 0, 'followers' : 0}
        followings = Follow_relationship.query.filter_by(follower_user_id = user_id)
        followers = Follow_relationship.query.filter_by(user_id = user_id)
        for following in followings:
            if following.created_time.month == init_month and following.created_time.year == init_year:
                month_dict['followings'] += 1

        for follower in followers:
            if follower.created_time.month == init_month and follower.created_time.year == init_year:
                month_dict['followers'] += 1
        init_month += 1
        stats.append(month_dict)

    return dumps({'follow_stats' : stats})


"""
Get number of saves for a given collection
Args:
    collection_id (integer): collection id of the collection
	token (string): to be used for session validation
Returns:
    saves (integer): number of saves for given collection

"""
@app.route(url_prefix + '/saves', methods=["GET"])
def get_save1():

	token = request.args.get('token')
	user = get_user(token)
	collection_id = int(request.args.get('collection_id'))
	saves = len(Saved_collection.query.filter_by(collection_id = collection_id).all())

	return dumps({'saves' : saves})
  