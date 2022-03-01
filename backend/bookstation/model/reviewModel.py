from bookstation import db

class Book(db.Model):

    __tablename__ = 'review'
    #Primary key reviewId (bookId, userId)
    #review column is nullable (user wants to submit rating only)
    #add column names and types
    #add relations

    def __init__(self):
        #add new user ratingreview
        return

    def postReview(reviewID):
        return

    def postRating(reviewId):
        return

    def updateReview(reviewId):
        return

    def updateRating(reviewId):
        return

    def removeReview(reviewId):
        #only remove review not rating
        #set review column to null
        return

    def removeRating():
        #remove entry completely
        #can only remove rating if one hasnt submitted a reivew
        return

    def getReviews(bookId):
        #return list
        return
