import yaml
from StoreObj import Store 
from DepartmentObj import Department
from AisleObj import Aisle
from ItemObj import Item
from ItemLocObj import ItemLoc

# The weight of the department when calculating store similarities
DEP_WEIGHT = 0.8

# The number of closest stores to check when running the function
N_CLOSEST = 3

"""
calcSimilarity

Calculates the similarity between the two given stores.
Does this by comparing the location between each identical item
in the store. The higher the number of items that the two
stores have in common, the higher the similarity.

@input  store1  The first StoreObj to compare
@input  store2  The second StoreObj to compare

@return Double  The similarity between the two stores
"""
def calcSimilarity(store1, store2):
    """
    calcDistFull

    Calculates the distance between the two given location
    by checking if the departments and aisles match. The more
    that match, the higher the distance value. Uses the DEP_WEIGHT
    global variable for weighing the department versus the aisle.

    @input  loc1    The first location to compare
    @input  loc2    The second location to compare

    @return Double  The distance between the two locations
    """
    def calcDistFull(loc1, loc2):
        # Compare the departments and aisles
        depComp = int(loc1.getDepartment().getName() == loc2.getDepartment().getName())
        aisleComp = int(loc1.getAisle().getNumber() == loc2.getAisle().getNumber())

        # Preform the distance calculation
        dist = (DEP_WEIGHT * depComp) + (1 - DEP_WEIGHT) * aisleComp

        return(dist)

    # Get all items
    items1 = store1.getAllItems()
    items2 = store2.getAllItems()

    # Get the names of the items
    itemNames1 = [item.getName() for item in items1]
    itemNames2 = [item.getName() for item in items2]

    # Get the items that the two stores have in common
    itemIntersect = [name for name in itemNames1 if name in itemNames2]

    # Get the names of the items in both stores
    items1 = [item for item in items1 if item.getName() in itemIntersect]
    items2 = [item for item in items2 if item.getName() in itemIntersect]

    # Sort the items in alphabetical order
    items1.sort(key=lambda x: x.getName())
    items2.sort(key=lambda x: x.getName())

    # Get the distance for each item to calculate the total distance
    totDist = 0
    for i in range(len(items1)):
        totDist += calcDistFull(items1[i].getLoc(), items2[i].getLoc())

    # Perform the similarity calculation
    similarity = totDist / len(itemIntersect)

    return(similarity)

"""
loadInfo

Loads the yaml file at the given path and
places the data in a dictionary in the
format that the algorithm needs.

@input  pathToYaml  The path to the yaml file to parse

@return A list of the stores parsed from the yaml file
"""
def loadInfo(pathToYaml):
    data = {}

    # Write the generated data to a yaml file
    with open(pathToYaml, "r") as f:
        data = yaml.load(f, yaml.SafeLoader)

    stores = []

    for storeName in data:
        store = Store(storeName)

        for departmentName in data[storeName]["DEPARTMENTS"]:
            department = Department(departmentName, (0, 0), (0, 0))

            for aisleNum in data[storeName]["DEPARTMENTS"][departmentName]:
                aisle = Aisle(aisleNum, [])

                for itemName in data[storeName]["DEPARTMENTS"][departmentName][aisleNum]:
                    loc = ItemLoc(store, department, aisle)
                    item = Item(itemName, loc)

                    aisle.addItem(item)

                department.addAisle(aisle)

            store.addDepartment(department)

        stores.append(store)

    return(stores)

"""
checkStoreForItem

Checks if the given store has the given item.

@input  store   The StoreObj to check
@input  itemName    The name of the item to look for

@return Boolean True if the store has the item
                False otherwise
"""
def checkStoreForItem(store, itemName):
    # Get all of the items in the store
    items = store.getAllItems()
    items = [item.getName() for item in items]

    # Check if the item is in the list
    if itemName in items:
        return(True)

    return(False)

"""
getLoc

Gets the location of the given item in the
given store. If the item is not in the store,
returns None.

@input  store   The StoreObj to check
@input  itemName    The name of the item to get the location of

@return The location of the item in the store. None if the item is not in the store.
"""
def getLoc(store, itemName):
    items = store.getAllItems()

    for i in range(len(items)):
        if items[i].getName() == itemName:
            return(items[i].getLoc())

    return(None)

"""
predictLoc

Predicts the location of the given item in the given store using
the list of known stores to determine the prediction. Uses a KNN
based algorithm for the estimation:
    First calculates the N_CLOSEST stores
    Gets the location of the item in those stores
    Determines the most likely location using the gathered locations

@input  knownStores The list of known StoreObjs
@input  store       The store to estimate the location in
@input  itemName    The name of the item to calculate the location of

@return The most likely location of the item
"""
def predictLoc(knownStores, store, itemName):
    # Get the known stores that contain the item
    knownStores = [tempStore for tempStore in knownStores if checkStoreForItem(tempStore, itemName)]

    # Calculate the similarity between each store that has the item and the given store
    similarities = [[tempStore, calcSimilarity(store, tempStore)] for tempStore in knownStores if tempStore != store]
    similarities.sort(key=lambda x: x[1], reverse=True)
    stores, similarities = list(zip(*(similarities)))

    # Get the N_CLOSEST stores
    stores = stores[:N_CLOSEST]

    # Get all of the location in the closest stores
    locs = [getLoc(tempStore, itemName) for tempStore in stores]

    # Determine how much each department and aisle occurs
    # in the closest stores
    depCount = {}
    aisleCount = {}
    for loc in locs:
        dep = loc.getDepartment().getName()
        aisle = str(loc.getAisle().getNumber())

        if dep not in depCount:
            depCount[dep] = 0

        if aisle not in aisleCount:
            aisleCount[aisle] = 0

        depCount[dep] += 1
        aisleCount[aisle] += 1

    # Get the most likely departmant and aisle
    dep = max(depCount, key=depCount.get)
    aisle = max(aisleCount, key=aisleCount.get)

    # Create the location object
    loc = ItemLoc(None, dep, aisle)

    return(loc)


if __name__ == "__main__":
    stores = loadInfo("temp.yaml")

    # STORE_1, ITEM_10
    predictLoc(stores, stores[1], "ITEM_10")