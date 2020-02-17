import json

allMaps = {}
justMaps = []

with open("C:\\Users\\brams\\Downloads\\grocerylist-dd21a-export.json") as f:
    data = json.load(f)
    stores = data["stores"]
    for addr in stores:
        storesAtAddr = stores[addr]
        for store in storesAtAddr:
            maps = storesAtAddr[store]["maps"]
            for currMap in maps:
                if addr not in allMaps:
                    allMaps[addr] = {}
                if store not in allMaps[addr]:
                    allMaps[addr][store] = []
                allMaps[addr][store].append(currMap["map"])
                justMaps.append(currMap["map"])

compDict = {}
for refMap in justMaps:
    compDict[refMap] = {}
    for compMap in justMaps:
        score = 0

        compDict[refMap][compMap] = score





