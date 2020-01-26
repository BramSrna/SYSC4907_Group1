import sys
import flask
import firebase_admin
import firebase_admin

from firebase_admin import db
from firebase_admin import credentials

sys.path.insert(1, './RecommendItemFiles')

from RecommendItems import getRules

cred = credentials.Certificate("./grocerylist-dd21a-firebase-adminsdk-6uwbb-0f0ee1448b.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://grocerylist-dd21a.firebaseio.com"})

ITEMS_KEY = "items"
GEN_NAME_KEY = "genName"

def genRules(request):
    listRef = db.reference("/lists")
    lists = listRef.get()

    listItems = []
    for listId in lists:
        currItems = []
        currList = lists[listId]

        if ITEMS_KEY in currList:
            items = lists[listId][ITEMS_KEY]
            for itemId in items:
                currItems.append(items[itemId][GEN_NAME_KEY])
            listItems.append(currItems)

    print("UPDATE")

    rules = getRules(listItems)
    finalRules = []

    print("RULES", rules)

    for item in rules:
        for rule in rules[item]:
            db.reference("/recommendations/" + rule.getPrior()).push(rule.getAntecedent())
            finalRules.append((rule.getPrior(), rule.getAntecedent()))

    return flask.jsonify(finalRules)