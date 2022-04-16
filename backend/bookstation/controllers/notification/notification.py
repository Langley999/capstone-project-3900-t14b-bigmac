from json import dumps
from bookstation.models.book_sys import Book
from bookstation.models.user_sys import Notification_history
from bookstation.models.user_sys import Notification
from bookstation import app, request, db
from bookstation.models.user_sys import User
from bookstation.utils.auth_util import get_user
from sqlalchemy import desc

"""
Function for users to check number of new notifications
Args:
	token (string): token of the user
Returns:
	- to_read (int): book id
	
"""
@app.route("/notification/checknew", methods=["GET"])
def checknewnotif():
	token = request.args.get('token')
	user = get_user(token)
	notifications = Notification.query.filter_by(user_id=user.user_id).all()
	notification_history = Notification_history.query.filter_by(user_id=user.user_id).first()
	if notification_history == None:
		return dumps({ 'to_read' : len(notifications)})
	else:
		notification_history.last_read
		return dumps({ 'to_read' : len(notifications)-notification_history.last_read})
		
"""
Function for users to get all notification history
Args:
	token (string): token of the user
Returns:
	- to_read (int): book id
"""
@app.route("/notification/getall", methods=["GET"])
def getallnotif():

	token = request.args.get('token')
	user = get_user(token)
	all_notifications = []

	notifications = Notification.query.filter_by(user_id = user.user_id).order_by(desc(Notification.time)).all()
	for notification in notifications:
		sender = User.query.get(notification.sender_id)
		notif = {
			'sender_name': sender.username,
			'sender_id': notification.sender_id,
			'type': notification.type,
			'time': str(notification.time)
		}
		if notification.type_id != -1 :
			notif['book_id'] = notification.type_id
			notif['book_name'] = Book.query.get(notification.type_id).title
		all_notifications.append(notif)
		history = Notification_history.query.filter_by(user_id=user.user_id).first()

	history.last_read = len(all_notifications)
	db.session.add(history)
	db.session.commit()

	return dumps({'notifications' : all_notifications})