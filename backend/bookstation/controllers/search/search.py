from json import dumps
from bookstation import app, request, db, error
from bookstation.models.book_sys import *
from sqlalchemy import func
#from bookstation.utlis.auth_util import login_status_check

url_prefix = '/search'

@app.route(url_prefix + "/searchbook", methods=["GET"])
def search():
    """
    Function for users to to get results of the search. 
    Args:
        type (string): author or title
        value (string): the search text
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
    except:
        raise error.BadReqError(description="invalid params")
    if (search_type == 'author'):
        # print(type(search_book_author(search_value)))
        search_result = search_book_author(search_value)
    if (search_type == 'title'):
        search_result = search_book_title(search_value)

    return search_result

def search_book_author(author_name):
    #authors = Author.query.filter(func.lower(name)==author_name.lower()).all()
    #authors = Author.query.filter_by(name=author_name).all()
    authors = Author.query.filter(Author.name.ilike('%'+author_name+'%'))
    allbooks = []
    allauthors = []
    
    for author in authors:
        # print(author.books)
        book_authors = Book_author.query.filter_by(author_id=author.author_id).all()
        
        for book_author in book_authors:
            book = book_author.book
            book_info = {}
            book_info['id'] = book.book_id
            book_info['title'] = book.title
            book_info['author'] = book.author_string
            book_info['num_rating'] = book.num_rating
            book_info['cover'] = book.cover_image
            book_info['average_rating'] = book.average_rating
            book_info['publish_date'] = book.publish_date
            allbooks.append(book_info)
        allauthors.append(author.name+"==="+str(author.author_id))

    return dumps({
      "books": allbooks[0:20]
    })

def search_book_title(book_title):
    book_exact = Book.query.filter(Book.title.like(book_title)).all()
    books = Book.query.filter(Book.title.like('%'+book_title+'%')).all()
    allbooks = []
    for book in book_exact:
        book_info = {}
        book_info['id'] = book.book_id
        book_info['title'] = book.title
        book_info['author'] = book.author_string
        book_info['num_rating'] = book.num_rating
        book_info['cover'] = book.cover_image
        book_info['average_rating'] = book.average_rating
        book_info['publish_date'] = book.publish_date
        allbooks.append(book_info)
    for book in books:
        book_info = {}
        book_info['id'] = book.book_id
        book_info['title'] = book.title
        book_info['author'] = book.author_string
        book_info['num_rating'] = book.num_rating
        book_info['cover'] = book.cover_image
        book_info['average_rating'] = book.average_rating
        book_info['publish_date'] = book.publish_date
        allbooks.append(book_info)
    return dumps({
      "books": allbooks[0:20]
    })
