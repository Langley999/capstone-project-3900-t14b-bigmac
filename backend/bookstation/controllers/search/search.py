from json import dumps
from bookstation import app, request, db, error
from bookstation.models.book_sys import *
from sqlalchemy import func, desc
import time
#from bookstation.utlis.auth_util import login_status_check

url_prefix = '/search'

@app.route(url_prefix + "/searchbook", methods=["GET"])
def search():
    """
    Function for users to to get results of the search. 
    Args:
        type (string): author or title
        value (string): the search text
        rating (int): rating threshold
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
    search_result = None
    try:
        search_type = request.args.get('type')
        search_value = request.args.get('value')
        rating_filter = int(request.args.get('rating'))
    except:
        raise error.BadReqError(description="invalid params")
    if (search_type == 'author'):
        # print(type(search_book_author(search_value)))
        search_result = search_book_author(search_value, rating_filter)
    if (search_type == 'title'):
        search_result = search_book_title(search_value, rating_filter)

    return search_result

def search_book_author(author_name, rating_filter):
    #authors = Author.query.filter(Author.name.ilike('%'+author_name+'%'))
    allbooks = []
    i = 0
    '''
    for author in authors:
        book_authors = Book_author.query.filter_by(author_id=author.author_id).all()
        
        for book_author in book_authors:
            book = book_author.book
            if book.average_rating >= rating_filter:
                book_info = {}
                book_info['id'] = book.book_id
                book_info['title'] = book.title
                book_info['author'] = book.author_string
                book_info['num_rating'] = book.num_rating
                book_info['cover'] = book.cover_image
                book_info['average_rating'] = book.average_rating
                book_info['publish_date'] = book.publish_date
                allbooks.append(book_info)
                i+=1
                if i > 50:
                    break    
    '''

    books = Book.query.filter(Book.author_string.like('%'+author_name+'%')).filter(Book.average_rating >= rating_filter).all()

    results = []
    i = 0

    for book in books:
        book_info = {}
        book_info['id'] = book.book_id
        book_info['title'] = book.title
        book_info['author'] = book.author_string
        book_info['num_rating'] = book.num_rating
        book_info['cover'] = book.cover_image
        book_info['average_rating'] = book.average_rating
        book_info['publish_date'] = book.publish_date
        results.append(book_info)
        i+=1
        if i > 50:
            break   


    return dumps({
      "books": results
    })

def search_book_title(book_title, rating_filter):
    book_exact = Book.query.filter(Book.title.like(book_title)).all()
    books = Book.query.filter(Book.title.like('%'+book_title+'%')).all()
    allbooks = []
    i = 0
    print(rating_filter)
    for book in book_exact:
        if book.average_rating >= rating_filter:
            book_info = {}
            book_info['id'] = book.book_id
            book_info['title'] = book.title
            book_info['author'] = book.author_string
            book_info['num_rating'] = book.num_rating
            book_info['cover'] = book.cover_image
            book_info['average_rating'] = book.average_rating
            book_info['publish_date'] = book.publish_date
            allbooks.append(book_info)
            i+=1
            if i > 50:
                break
    for book in books:
        
        if book.average_rating >= rating_filter: 
            book_info = {}
            book_info['id'] = book.book_id
            book_info['title'] = book.title
            book_info['author'] = book.author_string
            book_info['num_rating'] = book.num_rating
            book_info['cover'] = book.cover_image
            book_info['average_rating'] = book.average_rating
            book_info['publish_date'] = book.publish_date
            allbooks.append(book_info)
            i+=1
            if i > 50:
                break
    return dumps({
      "books": allbooks
    })

@app.route(url_prefix + "/genre", methods=["GET"])
def genre():
    """
    Function for users to search by genre 
    Args:
        genres (string): list of genres separated by '&' e.g. 'Fiction&Young Adult&Magic'
        rating (int): rating threshold
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

    try:
        genre_names = request.args.get('genres')
        rating_filter = int(request.args.get('rating'))
    except:
        raise error.BadReqError(description="invalid params")

    genres = genre_names.split('&')
    all_books = []
    for genre in genres:
        books = Book.query.filter(Book.genre_string.like('%'+genre+'%')).filter(Book.average_rating >= rating_filter).all()
        booklist = []
        for book in books:
            booklist.append(book.book_id)
        all_books.append(booklist)
    books = set.intersection(*[set(x) for x in all_books])  
    results = []
    i = 0

    for id in books:
        book = Book.query.get(id)
        book_info = {}
        book_info['id'] = book.book_id
        book_info['title'] = book.title
        book_info['author'] = book.author_string
        book_info['num_rating'] = book.num_rating
        book_info['cover'] = book.cover_image
        book_info['average_rating'] = book.average_rating
        book_info['publish_date'] = book.publish_date
        results.append(book_info)
        i+=1
        if i > 50:
            break   
    '''
    genre_ids = []

    for genre in genres:
        gen = Genre.query.filter_by(name=genre).first()
        genre_ids.append(gen.genre_id)
    all_books = []
    start = time.process_time()
    for genre_id in genre_ids:
        booklist = []
        gen_books = Book_genre.query.filter_by(genre_id=genre_id).all()
        for gen_book in gen_books:
            #if gen_book.book.average_rating >= rating_filter:
            bookid = gen_book.book_id
            booklist.append(bookid)
        all_books.append(booklist)
    print(time.process_time() - start)
    start = time.process_time()
    books = set.intersection(*[set(x) for x in all_books])  
    print(time.process_time() - start)
    results = []
    i = 0
    start = time.process_time()
    for id in books:
        book = Book.query.get(id)
        if book.average_rating >= rating_filter: 
            book_info = {}
            book_info['id'] = book.book_id
            book_info['title'] = book.title
            book_info['author'] = book.author_string
            book_info['num_rating'] = book.num_rating
            book_info['cover'] = book.cover_image
            book_info['average_rating'] = book.average_rating
            book_info['publish_date'] = book.publish_date
            #book_info['genre'] = book.genre_string
            results.append(book_info)
            i+=1
            if i > 50:
                break   
   
    print(time.process_time() - start)    
    results.sort(key = lambda x: x['average_rating'], reverse=True)
    '''
 

    
    return dumps({
      "books": results
    })


