import re
import xlrd
from xlrd.sheet import ctype_text
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import copy

path = "C:\\Users\\brams\\Downloads\\grocerylist-dd21a-firebase-adminsdk-6uwbb-494a5986eb.json"

cred = credentials.Certificate(path)
defaultApp = firebase_admin.initialize_app(cred, {
    'databaseURL' : "https://grocerylist-dd21a.firebaseio.com"
})

filename = "../Item Information (Manual Data Collection).xlsx"
storeInfoPage = "Store Information"

xlWorkbook = xlrd.open_workbook(filename)
sheetNames = xlWorkbook.sheet_names()
storeSheet = xlWorkbook.sheet_by_name(storeInfoPage)

sheetNames.remove(storeInfoPage)

def parseStrForDeps(strToParse):
    strToParse = strToParse[1:]
    strToParse = strToParse[:-1]
    strToParse = strToParse.replace("\n", "")

    regex = re.compile("[\(\[].*?[\)\]]")

    while "[" in strToParse:
        strToParse = re.sub(regex, "", strToParse)

    parts = strToParse.split(",")

    parts = [part.strip() for part in parts]

    return(parts)

def getVal(sheet, row, col):
    cellObj = sheet.cell(row, col)
    return(cellObj.value)

def parseSize(size):
    size = str(size)
    if ((size == "N/A") or (size.strip() == "")):
        return None, None
    else:
        unit = ""
        if "Kg" in size:
            unit = "Kg"
        elif "g" in size:
            unit = "g"
        elif "mL" in size:
            unit = "mL"
        elif "L" in size:
            unit = "L"
        elif "lb" in size:
            unit = "lb"

        size = size.replace(unit, "")
        size = float(size)

        return size, unit


def parseStrForTags(strToParse):
    strToParse = strToParse.replace("\n", " ")

    parts = strToParse.split(" - ")
    parts = [part for part in parts if "[" in part]
    tags = []
    for part in parts:
        tempTags = []

        strTags = part[part.find("[") + 1:part.find("]")]
        strTags = strTags.split(", ")

        for strTag in strTags:
            tempTags.append(strTag)

        tags.insert(0, tempTags)

    return(tags)
        

rowStart = 2
rowEnd = 9

stores = []

while (rowStart <= rowEnd):
    vals = {
        "name" : getVal(storeSheet, rowStart, 0),
        "address" : getVal(storeSheet, rowStart, 1),
        "franchiseName" : getVal(storeSheet, rowStart, 2),
        "map" : getVal(storeSheet, rowStart, 3),
        "aisleTags" : getVal(storeSheet, rowStart, 4),
        "items" : []
    }

    vals["map"] = parseStrForDeps(vals["map"])
    vals["aisleTags"] = parseStrForTags(vals["aisleTags"])

    stores.append(vals)

    rowStart += 1

storeIds = []

for store in stores:
    ref = db.reference('stores')
    storeId = ref.push(store)
    storeIds.append(storeId.key)

sheetNames = ["Item Information (Independent 2",
              "Sheet6",
              "Item Information (Food Basic 16",
              "Item Information (South Keys Wa",
              "Item Information (Bank Metro)",
              "Item Information (South Keys Lo",
              "Item Information (Walmart - 227"]

for i in range(len(sheetNames)):
    sheetName = sheetNames[i]
    currSheet = xlWorkbook.sheet_by_name(sheetName)

    rowStart = 2
    rowEnd = 51

    items = []

    while ((rowStart <= rowEnd) and (rowStart < currSheet.nrows)):
        vals = {
            "genericName" : getVal(currSheet, rowStart, 0),
            "specificName" : getVal(currSheet, rowStart, 1),
            "price" : getVal(currSheet, rowStart, 5),
            "size" : getVal(currSheet, rowStart, 6),
            "locs" : {
                "aisleNum" : getVal(currSheet, rowStart, 4),
                "department" : getVal(currSheet, rowStart, 3),
                "store" : storeIds[i]
            }
        }

        size, unit = parseSize(vals["size"])
        vals["size"] = size
        vals["sizeUnit"] = unit

        for key in vals:
            val = str(vals[key])
            if ((val == "N/A") or (val.strip() == "")):
                vals[key] = None

        for key in vals["locs"]:
            val = str(vals["locs"][key])
            if ((val == "N/A") or (val.strip() == "")):
                vals["locs"][key] = None

        items.append(vals)

        rowStart += 1

    stores[i]["items"] = items

itemIds = []

for store in stores:
    tempIds = []
    items = store["items"]
    for item in items:
        ref = db.reference('items')
        currItems = ref.get()
        itemId = None
        if (currItems != None):
            for item2 in currItems:
                tempId = item2
                item2 = currItems[item2]
                if (("genericName" in item2) and
                    ("specificName" in item2) and
                    (item2["genericName"] == item["genericName"]) and
                    (item2["specificName"] == item["specificName"])):
                    itemId = tempId
                elif (("genericName" in item2) and
                      ("specificName" not in item2) and
                      (item2["genericName"] == item["genericName"])):
                    itemId = tempId

        if (itemId == None):
            itemCopy = copy.copy(item)
            itemCopy.pop("locs", None)

            ref = db.reference("items")
            itemId = ref.push(itemCopy)
            itemId = itemId.key

        ref = db.reference('items/' + itemId + "/locs/")
        tempDict = {}
        neededKeys = ["store", "department", "aisleNum"]
        item = item["locs"]
        for key in neededKeys:
            if key in item:
                tempDict[key] = item[key]
        ref.push(tempDict)

        tempIds.append(itemId)
    itemIds.append(tempIds)

for i in range(len(storeIds)):
    storeId = storeIds[i]
    tempItemIds = itemIds[i]
    for j in range(len(tempItemIds)):
        itemId = tempItemIds[j]
        print(storeId, itemId)
        path = 'stores/' + storeId + "/items/" + itemId
        ref = db.reference(path)

        temp = stores[i]["items"][j]["locs"]
        tempDict = {}
        neededKeys = ["department", "aisleNum"]
        for key in neededKeys:
            if key in temp:
                tempDict[key] = temp[key]

        ref.update(tempDict)