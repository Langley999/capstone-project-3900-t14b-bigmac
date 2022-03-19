from json import dumps
from bookstation import app, request, db, error
from bookstation.models.book_sys import *
from sqlalchemy import func, desc
#from bookstation.utlis.auth_util import login_status_check

url_prefix = '/recommendation'

@app.route(url_prefix + "/toprating", methods=["GET"])
def toprating():
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

    
    
