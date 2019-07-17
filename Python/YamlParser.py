import yaml
import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

from StoreObj import Store
from DepartmentObj import Department
from AisleObj import Aisle
from ItemObj import Item
from ItemLocObj import ItemLoc

"""
parseTestYamlFile

Parses the given test YAML file and creates
the objects detailed in the file.

@input  pathToFile  Path to the test file to parse

@return The list of Stores created
"""
def parseTestYamlFile(pathToFile):
    contents = {}

    # Open the file and load the contents
    with open(pathToFile, 'r') as stream:
        try:
            contents = yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

    # Parse the stores in the file
    stores = []
    if "STORES" in contents:
        for store in contents["STORES"]:
            stores.append(parseStoreDict(store))

    return(stores)

"""
parseStoreDict

Parses a dictionary that describes a Store
object and returns the Store object. Parses
the internal dictionaries as well to create
the needed Departments, Aisles, and Items.

@input  dictToParse The dictionary to parse to create the Store

@return The created Store object
"""
def parseStoreDict(dictToParse):
    name = ""
    width = -1
    length = -1

    # Get the name, length, and width of the Store
    if "Name" in dictToParse:
        name = dictToParse["Name"]
    
    if "Length" in dictToParse:
        length = dictToParse["Length"]

    if "Width" in dictToParse:
        width = dictToParse["Width"]

    store = Store(name, width, length)

    # Parse all internal Departments in the dictionary
    if "DEPARTMENTS" in dictToParse:
        for department in dictToParse["DEPARTMENTS"]:
            store.addDepartment(parseDepartmentDict(department, store))

    return(store)

"""
parseDepartmentDict

Parses a dictionary that describes a Department object. Creates
the Department with the parameters. Also creates any needed
Aisles and Items and adds them to the Department.

@input  dictToParse The dictionary detailing the Department object
@input  currStore   The Store this Department belongs to

@return The Department created from this dictionary
"""
def parseDepartmentDict(dictToParse, currStore):
    name = ""
    topLeft = None
    bottomRight = None

    # Get the name, top left coordinate, and bottom right coordinate of the Department
    if "Name" in dictToParse:
        name = dictToParse["Name"]

    if "TopLeft" in dictToParse:
        topLeft = dictToParse["TopLeft"]

    if "BottomRight" in dictToParse:
        bottomRight = dictToParse["BottomRight"]

    department = Department(name, topLeft, bottomRight)

    # Parse all internal Aisles in the dictionary and adds them to the Department
    if "AISLES" in dictToParse:
        for aisle in dictToParse["AISLES"]:
            department.addAisle(parseAisleDict(aisle, currStore, department))

    return(department)

"""
parseAisleDict

Parses the given dictionary detailing an Aisle object and creates
the Aisle object. Also parses the internal Item dictionaries
and adds those Items to the Aisle.

@input  dictToParse     The dictionary detailing the Aisle object
@input  currStore       The store that this Aisle belongs to
@input  currDepartment  The department that this Aisle belongs to

@return The Aisle created using the information from the dictionary
"""
def parseAisleDict(dictToParse, currStore, currDepartment):
    num = ""
    tags = None

    # Get the number and list of tags needed for the Aisle
    if "Number" in dictToParse:
        num = dictToParse["Number"]

    if "Tags" in dictToParse:
        tags = dictToParse["Tags"]

    aisle = Aisle(num, tags)

    # Parse all internal Items in the dictionary and add them to the Aisle
    if "ITEMS" in dictToParse:
        for item in dictToParse["ITEMS"]:
            aisle.addItem(parseItemDict(item, currStore, currDepartment, aisle))

    return(aisle)

"""
parseItemDict

Parses the dictionary detailing an Item object and returns
the created Item.

@input  dictToParse     The dictionary detailing the item
@input  currStore       The Store that this item belongs to
@input  currDepartment  The Department that this item belongs to
@input  currAisle       The Aisle that this item belongs to

@return The created Item object
"""
def parseItemDict(dictToParse, currStore, currDepartment, currAisle):
    name = ""

    # Get the name of the Item
    if "Name" in dictToParse:
        name = dictToParse["Name"]
        
    # Create the Item and Item location object with the information
    itemLoc = ItemLoc(currStore, currDepartment, currAisle)
    item = Item(name, itemLoc)

    return(item)

    