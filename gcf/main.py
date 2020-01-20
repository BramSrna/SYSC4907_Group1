import firebase_admin
from firebase_admin import db
import flask


import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("./grocerylist-dd21a-firebase-adminsdk-6uwbb-0f0ee1448b.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://grocerylist-dd21a.firebaseio.com"})

data = db.reference("/items/Apples")

def hello_http(request):
    test = data.get()

    return flask.jsonify(test)