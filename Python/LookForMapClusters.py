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
    compDict[str(refMap)] = {}
    for compMap in justMaps:
        score = 0

        refMapUnique = list(set(refMap) - set(compMap))
        compMapUnique = list(set(compMap) - set(refMap))

        refMapRem = [dep for dep in refMap if dep not in refMapUnique]
        compMapRem = [dep for dep in compMap if dep not in compMapUnique]

        meanDif = {}

        for i in range(len(refMapRem)):
            dep = refMapRem[i]
            if dep not in meanDif:
                meanDif[dep] = [i, -1]

        for i in range(len(compMapRem)):
            dep = compMapRem[i]
            if meanDif[dep][1] == -1:
                meanDif[dep][1] = i

        for key in meanDif:
            vals = meanDif[key]
            score += (vals[0] - vals[1]) ** 2

        score /= len(refMapRem)

        score += len(refMapUnique)
        score += len(compMapUnique)

        compDict[str(refMap)][str(compMap)] = score







