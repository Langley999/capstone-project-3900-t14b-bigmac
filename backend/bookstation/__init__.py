from flask import Flask

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config')
# next line is for multi env
# app.config.from_pyfile('config.py')

from bookstation import views
