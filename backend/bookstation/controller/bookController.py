from json import dumps
from sqlite3 import Timestamp
import time
from bookstation import app, request, db, error
from bookstation.model.bookModel import Book
from config import SECRET
import hashlib
import jwt

url_prefix = "/book"

@app.route(url_prefix + "/details", methods=["GET"])
def bookDetails():
    return

@app.route(url_prefix + "/details/reviews", methods=["POST"])
def addBookReview():
    return

@app.route(url_prefix + "/details/ratings", methods=["POST"])
def addBookRating():
    return

@app.route(url_prefix + "/details/ratings", methods=["PUT"])
def editBookRating():
    return

@app.route(url_prefix + "/details/reviews", methods=["PUT"])
def editBookReview():
    return

@app.route(url_prefix + "/details/rating", methods=["DELETE"])
def removeBookRating():
    return