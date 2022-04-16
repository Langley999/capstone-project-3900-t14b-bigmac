from json import dumps
from bookstation import app, request, error
from bookstation.models.book_sys import *
from sqlalchemy import desc
import math

url_prefix = '/search'
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
@app.route(url_prefix + "/searchbook", methods=["GET"])
def search():
    search_result = None
    try:
        search_type = request.args.get('type')
        search_value = request.args.get('value')
        rating_filter = int(request.args.get('rating'))
        page = int(request.args.get('page'))
    except:
        raise error.BadReqError(description="invalid params")
    if (search_type == 'author'):
        search_result = search_book_author(search_value, rating_filter,page=page)
    if (search_type == 'title'):
        search_result = search_book_title(search_value, rating_filter,page=page)

    return search_result

def search_book_author(author_name, rating_filter,page):
    books = Book.query.filter(Book.author_string.like('%'+author_name+'%')).filter(Book.average_rating >= rating_filter).order_by(desc(Book.average_rating)).paginate(
                page=page,
                per_page=12,
                max_per_page=12,
                error_out=False
            )

    results = []

    for book in books.items:
        book_info = {
            'id': book.book_id,
            'title': book.title,
            'author': book.author_string,
            'num_rating': book.num_rating,
            'cover': book.cover_image,
            'average_rating': book.average_rating,
            'publish_date': book.publish_date
        }
        results.append(book_info)

    return dumps({
      "books": results,
      "pages": books.pages
    })

def search_book_title(book_title, rating_filter,page):
    allbooks = []
    books = Book.query.filter(Book.title.like('%'+book_title+'%')).filter(Book.average_rating >= rating_filter).order_by(desc(Book.average_rating)).paginate(
            page=page,
            per_page=12,
            max_per_page=12,
            error_out=False
        )
            
    for book in books.items:

        book_info = {
            'id': book.book_id,
            'title': book.title,
            'author': book.author_string,
            'num_rating': book.num_rating,
            'cover': book.cover_image,
            'average_rating': book.average_rating,
            'publish_date': book.publish_date
        }
        allbooks.append(book_info)

    pages = books.pages 

    return dumps({
      "books": allbooks,
      "pages": pages
    })


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
@app.route(url_prefix + "/genre", methods=["GET"])
def genre():
    try:
        genre_names = request.args.get('genres')
        rating_filter = int(request.args.get('rating'))
    except:
        raise error.BadReqError(description="invalid params")

    page = request.args.get('page')
    if page == None:
        page = 0
    else:
        page = int(page)-1
    genres = genre_names.split('&')
    all_books = []
    for genre in genres:
        books = Book.query.filter(Book.genre_string.like('%'+genre+'%')).filter(Book.average_rating >= rating_filter).order_by(Book.average_rating.desc()).all()
        booklist = []
        for book in books:
            booklist.append((book.book_id,book.average_rating))
        all_books.append(booklist)
    books = set.intersection(*[set(x) for x in all_books])  
 
    pages = math.ceil(len(books)/12)
    results = []
    books2 = list(books)
    books2.sort(key = lambda x: x[1], reverse=True)
    for id,rating in books2[page*12:page*12+13]:
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
    return dumps({
      "books": results,
      "pages": pages
    })


