from bookstation import app


@app.route("/login")
def auth_login():
    return "you are going to login"
