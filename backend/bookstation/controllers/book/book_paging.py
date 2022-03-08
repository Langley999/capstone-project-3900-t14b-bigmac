from json import dumps
from bookstation import app, request, db, error
from bookstation.models.book_sys import *
from bookstation.utlis.auth_util import login_status_check

url_prefix = '/book'
PAGESIZE = 3
SEARCH_AUTHOR = 'author'
SEARCH_TITLE = 'title'

@app.route(url_prefix + "/search", methods=["GET"])
def book_paging(page=1):
    try:
        search_type = request.args.get('type')
        search_value = request.args.get('value')
    except:
        raise error.BadReqError(description="invalid params")
    if (search_type ==SEARCH_AUTHOR):
        # print(type(search_book_author(search_value)))
        search_book_author(search_value)
    if (search_type == SEARCH_TITLE):
        a = search_book_title(search_value)
        b = a.paginate(page=page, per_page=PAGESIZE)
        print(type(a))
        for l in b.items:
            print(l.title)
        
    return dumps({})

def search_book_author(author_name):
    authors = Author.query.filter_by(name=author_name)
    for author in authors:
        # print(author.books)
        bs = author.books
        for b in bs:
            print(b.title)
    return None

def search_book_title(book_title):
    books = Book.query.filter(Book.title.like('%'+book_title+'%'))
    for book in books:
        print(book.title)
    return books
