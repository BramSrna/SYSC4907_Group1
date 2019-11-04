import yaml
from StoreObj import Store 
from DepartmentObj import Department
from AisleObj import Aisle
from ItemObj import Item
from ItemLocObj import ItemLoc

DEP_WEIGHT = 0.8

N_CLOSEST = 3

def calcSimilarity(store1, store2):
    def calcDistFull(loc1, loc2):
        depComp = int(loc1.getDepartment().getName() == loc2.getDepartment().getName())
        aisleComp = int(loc1.getAisle().getNumber() == loc2.getAisle().getNumber())

        dist = (DEP_WEIGHT * depComp) + (1 - DEP_WEIGHT) * aisleComp

        return(dist)

    items1 = store1.getAllItems()
    items2 = store2.getAllItems()

    itemNames1 = [item.getName() for item in items1]
    itemNames2 = [item.getName() for item in items2]

    itemIntersect = [name for name in itemNames1 if name in itemNames2]

    items1 = [item for item in items1 if item.getName() in itemIntersect]
    items2 = [item for item in items2 if item.getName() in itemIntersect]

    items1.sort(key=lambda x: x.getName())
    items2.sort(key=lambda x: x.getName())

    totDist = 0
    for i in range(len(items1)):
        totDist += calcDistFull(items1[i].getLoc(), items2[i].getLoc())

    return(totDist / len(itemIntersect))

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

def checkStoreForItem(store, itemName):
    items = store.getAllItems()
    items = [item.getName() for item in items]

    if itemName in items:
        return(True)

    return(False)

def getLoc(store, itemName):
    items = store.getAllItems()

    for i in range(len(items)):
        if items[i].getName() == itemName:
            return(items[i].getLoc())

    return(None)

def predictLoc(knownStores, store, itemName):
    knownStores = [tempStore for tempStore in knownStores if checkStoreForItem(tempStore, itemName)]

    similarities = [[tempStore, calcSimilarity(store, tempStore)] for tempStore in knownStores if tempStore != store]
    similarities.sort(key=lambda x: x[1], reverse=True)
    stores, similarities = list(zip(*(similarities)))

    stores = stores[:N_CLOSEST]

    locs = [getLoc(tempStore, itemName) for tempStore in stores]

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

    dep = max(depCount, key=depCount.get)
    aisle = max(aisleCount, key=aisleCount.get)

    return(ItemLoc(None, dep, aisle))


if __name__ == "__main__":
    stores = loadInfo("temp.yaml")

    # STORE_1, ITEM_10
    predictLoc(stores, stores[1], "ITEM_10")