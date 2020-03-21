/**
 * StoreObj
 * 
 * A store object used to format the various paths
 * and ids for stores.
 */
class StoreObj {
    /**
     * constructor
     * 
     * Creates a new store object
     * 
     * @param {String} address The address of the object
     * @param {String} storeName The store name of the object
     *                           default is null
     * 
     * @returns None
     */
    constructor(address, storeName) {
        this.address = address;
        this.storeName = storeName;
    }

    /**
     * getPath
     * 
     * Returns the expected path to the store.
     * Path is:
     *  /stores/${address}/${storeName}/
     * 
     * @param   None
     * 
     * @returns The path to the store
     */
    getPath() {
        var storePath = "/stores/" + this.address + "/" + this.storeName + "/";
        return(storePath);
    }

    /**
     * getId
     * 
     * Returns the expected id of the store.
     * The name is:
     *  ${address}&${storeName}
     * 
     * @param   None
     * 
     * @returns The id of the store
     */
    getId() {
        var storeId = this.address + "&" + this.storeName;
        return(storeId);
    }

    /**
     * getDispName
     * 
     * Returns the name of this store to display to the user.
     * The name is:
     *  ${storeName} - ${address}
     * 
     * @param   None
     * 
     * @returns The display name of the store
     */
    getDispName() {
        var storeName = this.storeName + " - " + this.address;
        return(storeName);

    }

    /**
     * getInfoFromId
     * 
     * Returns the store data corresponding to the
     * given id
     * 
     * @param {String} id The id of the store
     * 
     * @returns The data of the store
     */
    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            address: parts[0],
            storeName: parts[1]
        }
    }
}

/**
 * getStoreFromId
 * 
 * Returns the state of the store with the given
 * store id.
 * 
 * @param {Array} knownStores The array of all known stores
 * @param {String} storeId The id of the store to find
 * 
 * @returns The state of the store with the given id
 *          Null if the store is unknown
 */
function getStoreFromId(knownStores, storeId) {
    // Get the store's info from the given id
    var info = StoreObj.getInfoFromId(storeId);

    var address = info.address;
    var storeName = info.storeName;

    // Get the store
    if ((address in knownStores) && (storeName in knownStores[address])) {
        var store = knownStores[address][storeName];
    } else {
        return null;
    }

    return(store);
}

/**
 * getStoreMap
 * 
 * Calculates the most likely map of the given store
 * based on the known data. The map is calculate as follows:
 *  For each known map:
 *      Assign a weight to the department in the map
 *      based on the map's weight and the location of
 *      the department in the list
 * 
 *  Take the sum of the weights
 *  Sort the list based on the weights
 * 
 * @param {Database} database The database to parse
 * @param {String} storeId The id of the store
 */
function getStoreMap(database, storeId) {
    // Get the store's info from the id
    var info = StoreObj.getInfoFromId(storeId);
    var address = info.address;
    var storeName = info.storeName;

    // Get the path to the store
    var storePath = (new StoreObj(address, storeName)).getPath();

    // Get the current state of the store's maps
    var map = database.ref(storePath + "maps").once("value").then((snapshot) => {
        var ssv = snapshot.val();

        var mapCount = {};

        // Loop through all of the store's maps
        for (var tempMapId in ssv) {
            var tempMapObj = ssv[tempMapId];

            // Get the weight and order of the current map
            var weight = tempMapObj.weight;
            var tempMap = tempMapObj.map;

            // Loop through all of the departments in the current map
            for (var i = 0; i < tempMap.length; i++) {
                var dep = tempMap[i];

                // Add the department to the map count object if
                // it has not already been added
                if (!(dep in mapCount)) {
                    mapCount[dep] = 0;
                }

                // Update the current departments count
                mapCount[dep] = mapCount[dep] + i * weight;
            }
        }

        // Copy the map count data to a list
        var sortMap = [];
        for (dep in mapCount) {
            sortMap.push([dep, mapCount[dep]]);
        }

        // Sort the list based on the department's counts
        sortMap.sort((a, b) => {
            return a[1] - b[1];
        });

        // Parse out the final data
        var finalMap = [];
        for (i = 0; i < sortMap.length; i++){
            finalMap.push(sortMap[i][0]);
        }

        // Return the final map
        return finalMap;
    });

    return map;
}

/**
 * getItemLocInStore
 * 
 * Retrieves the location of the given item in
 * the given store. The location is the candidate
 * location with the highest count.
 * 
 * @param {Array} knownStores The array of known stores
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns An object containing the location with
 *          the location's department, aisle number,
 *          and aisle tags
 */
function getItemLocInStore(knownStores, storeId, itemId){
    var department = null;
    var aisleNum = null;
    var aisleTags = [];

    // Get the store's items
    var store = getStoreFromId(knownStores, storeId);

    if (store !== null) {        
        var itemList = store.items;

        // Parse the store's items to find the target item
        for (var tempItemId in itemList) {
            if (tempItemId === itemId) {
                // Item found
                var candItemInfo = itemList[tempItemId];
                var maxCount = -1;
                var info = null;

                // Loop through all of the candidate item infos to
                // find the location with the highest cound
                for (var tempCandItemInfoId in candItemInfo) {
                    var tempCandItemInfo = candItemInfo[tempCandItemInfoId];
                    if (tempCandItemInfo.count > maxCount) {
                        info = tempCandItemInfo;
                        maxCount = tempCandItemInfo.count;
                    }
                }

                // Get the location's information
                department = info.department;
                aisleNum = info.aisleNum;
                for (var tag in info.tags){
                    aisleTags.push(info.tags[tag]);
                }
            }
        }
    }

    // Return the information
    return {
        department: department,
        aisleNum: aisleNum,
        aisleTags: aisleTags
    };
}

/**
 * loadAllStoreInfo
 * 
 * Load the store table from the given database.
 * 
 * @param {Database} database The database to parse
 * 
 * @returns The stores table in an object
 */
function loadAllStoreInfo(database) {
    // Load the stores table
    var ref = database.ref('/stores');
    var retItems = ref.once('value').then((snapshot) => {
        var ssv = snapshot.val();

        return {
            stores: ssv
        };
    });

    return retItems;
}

/**
 * calcStoreSimilarity
 * 
 * Calculate the similarity between the two given stores.
 * 
 * TODO: Update the algorithm of this store
 * 
 * @param {Database} knownStores The array of known stores
 * @param {String} storeId1 The id of the first store
 * @param {String} storeId2 The id of the second store
 * 
 * @returns The similarity with 1 being the highest and 0 being the lowest
 */
function calcStoreSimilarity(knownStores, storeId1, storeId2){
    var store1 = getStoreFromId(knownStores, storeId1);
    var store2 = getStoreFromId(knownStores, storeId2);

    // Get the two stores' items
    var items1 = [];
    if (store1 !== null) {
        items1 = store1.items;
    }

    var items2 = [];
    if (store2 !== null) {
        items2 = store2.items;
    }

    var itemIntersect = [];
    var maxNumItems = 0;

    // Get the items common between both sets of items
    for (var itemId in items1){
        maxNumItems += 1;

        for (var itemId2 in items2){
            if (itemId === itemId2) {
                itemIntersect.push(itemId);
            }
        }
    }

    var similarity = 0;

    // Calculate the similarity between the two items' locations
    for (var i = 0; i < itemIntersect.length; i++) {
        itemId = itemIntersect[i];

        // Get the location of both items in their respective stores
        var loc1 = getItemLocInStore(knownStores, storeId1, itemId);
        var loc2 = getItemLocInStore(knownStores, storeId2, itemId);

        // Compare the departments and aisles
        var depComp = loc1.department === loc1.department ? 1 : 0;
        var aisleComp = loc1.aisleNum === loc2.aisleNum ? 1 : 0;

        // Calculate and update the similarity
        similarity += (0.8 * depComp) + (0.2 * aisleComp);
    }

    // Calculate the average similarity
    if (maxNumItems !== 0) {
        similarity = similarity / maxNumItems;
    }

    return(similarity);
}

exports.cloudCalculateStoreSimilarities = function(database) {
    // Load the stores table
    var temp = loadAllStoreInfo(database);
    var retItems = temp.then((value) => {
        var knownStores = value.stores;

        var storeIds = [];
        // Check all known stores to check if they contain the target item
        for (var tempAddress in knownStores){
            for (var tempStoreName in knownStores[tempAddress]){
                // Get the id of the current store
                var tempStoreId = (new StoreObj(tempAddress, tempStoreName)).getId();
                storeIds.push(tempStoreId);
            }
        }

        var storesWithItem = {};        
        // Calculate the similarity of all stores that contain the item
        for (var i = 0; i < storeIds.length; i++) {
            var id1 = storeIds[i];
            storesWithItem[id1] = {};
            for (var j = 0; j < storeIds.length; j++) {
                var id2 = storeIds[j];
                storesWithItem[id1][id2] = null;
            }
        }

        // Calculate the similarity of all stores that contain the item
        for (i = 0; i < storeIds.length; i++) {
            id1 = storeIds[i];
            for (j = 0; j < storeIds.length; j++) {
                id2 = storeIds[j];

                var score = null;
                var check = storesWithItem[id2][id1];
                if (check !== null) {
                    score = check;
                } else {
                    var temp = calcStoreSimilarity(knownStores, storeIds[i], storeIds[j]);
                    score = temp;
                }
                storesWithItem[id1][id2] = score;
            }
        }

        database.ref("/storeSimilarities/").update(storesWithItem);

        // Return the average location
        return {
            similarities: storesWithItem
        }
    });

    return retItems;

}

/**
 * predictItemLoc
 * 
 * Predicts the given item's location in the given store.
 * If the location is known, then it is returned. Otherwise
 * the location is predicted. To predict the location, the
 * algorithm first calculates the three most similar stores
 * that contain the item. The majority location is then used to
 * predict the location.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns An object containing the predicted location with
 *          the department, aisle number, and aisle tags.
 */
function predictItemLoc(database, storeId, itemId) {
    // Load the stores table
    var retItems = database.ref("storeSimilarities").once("value").then((snapshot) => {
        return snapshot.val();
    }).then((data) => {
        var storeSimilarities = data;
        var storeInfo = loadAllStoreInfo(database);
        return Promise.all([storeSimilarities, storeInfo]);
    }).then((data) => {
        var storeSimilarities = data[0];
        var knownStores = data[1].stores;

        // Check if the item location of the item in the
        // store is known
        var loc = getItemLocInStore(knownStores, storeId, itemId);

        var department = null;
        var aisleNum = null;
        var aisleTags = [];

        known = false;

        if (loc.department !== null){
            // If the location is known, then get the location's information
            department = loc.department;
            aisleNum = loc.aisleNum;
            aisleTags = loc.aisleTags;

            known = true;
        } else {
            // If the location is unknown, predict it
            var storesWithItem = [];

            // Check all known stores to check if they contain the target item
            for (var tempAddress in knownStores){
                for (var tempStoreName in knownStores[tempAddress]){
                    // Get the id of the current store
                    var tempStoreId = (new StoreObj(tempAddress, tempStoreName)).getId();

                    // Check if the current store contains the item
                    var tempLoc = getItemLocInStore(knownStores, tempStoreId, itemId);

                    if (tempLoc.department !== null) {
                        // If the store contains the item, then save the location
                        storesWithItem.push({
                            id: tempStoreId,
                            department: tempLoc.department,
                            aisleNum: tempLoc.aisleNum,
                            aisleTags: tempLoc.aisleTags
                        });
                    }
                }
            }

            // Calculate the similarity of all stores that contain the item
            for (var i = 0; i < storesWithItem.length; i++) {
                var temp = storeSimilarities[storeId][storesWithItem[i].id];
                storesWithItem[i].score = temp;
            }

            // Sort the stores with the item based on their score
            storesWithItem.sort((a, b) => {
                var valueA, valueB;

                valueA = a.score;
                valueB = b.score;

                if (valueA < valueB) {
                    return -1;
                } else if (valueA > valueB) {
                    return 1;
                } else {
                    return 0;
                }
            })

            // Get the three most similar stores
            storesWithItem = storesWithItem.slice(0, 3);

            depCount = {};
            aisleCount = {};

            // Calculate how often each department appears
            for (i = 0; i < storesWithItem.length; i++){
                var store = storesWithItem[i];
                var dep = store.department;
                var num = store.aisleNum;

                if (dep in depCount){
                    depCount[dep] += 1;
                } else {
                    depCount[dep] = 1;
                }

                if (num in aisleCount){
                    aisleCount[num] += 1;
                } else {
                    aisleCount[num] = 0;
                }
            }

            // Sort the locations based on their occurance counts
            department = Object.keys(depCount);
            if (department.length > 0) {
                department = department.reduce((a, b) => depCount.a > depCount.b ? a : b);
            } else {
                department = null;
            }

            aisleNum = Object.keys(aisleCount)
            if (aisleNum.length > 0) {
                aisleNum = aisleNum.reduce((a, b) => aisleCount.a > aisleCount.b ? a : b);
            } else {
                aisleNum = null;
            }
        }

        // Return the average location
        return {
            known: known,
            department : department,
            aisleNum : aisleNum,
            aisleTags : aisleTags
        }
    });

    return retItems;
}

function calcMapSimilarity(refMap, compMap) {
    var score = 0;

    // Get departments unique to each map
    var refMapUnique = refMap.filter((e1) => {
        return compMap.indexOf(e1) < 0;
    });
    var compMapUnique = compMap.filter((e1) => {
        return refMap.indexOf(e1) < 0;
    });

    // remove unique departments from each map
    var refMapRem = refMap.filter((e1) => {
        return refMapUnique.indexOf(e1) < 0;
    });
    var compMapRem = compMap.filter((e1) => {
        return compMapUnique.indexOf(e1) < 0;
    });

    // Calculate the mean squared difference of each department location
    var meanDif = {};

    for (var i = 0; i < refMapRem.length; i++){
        var dep = refMapRem[i];
        if (!(dep in meanDif)) {
            meanDif[dep] = [i, -1];
        }
    }

    for (i = 0; i < compMapRem.length; i++){
        dep = compMapRem[i];
        if (meanDif[dep][1] === -1) {
            meanDif[dep][1] = i;
        }
    }

    for (var key in meanDif){
        var vals = meanDif[key];
        score += (vals[0] - vals[1]) ** 2;
    }

    score /= refMapRem.length;
    
    //score += refMapUnique.length;
    //score += compMapUnique.length;

    return(score);

}

exports.cloudDetermineClusters = function(database) {
    var retVal = database.ref("/stores/").once("value").then((snapshot) => {
        var maps = [];
        var names = [];

        var ssv = snapshot.val();
        for (var addr in ssv) {
            var storesAtAddr = ssv[addr];
            for (var storeName in storesAtAddr) {
                var store = new StoreObj(addr, storeName)
                var id = store.getId();

                maps.push(getStoreMap(database, id));
                names.push(store.getDispName());
            }
        }

        return Promise.all([Promise.all(maps), names]);
    }).then((value) => {
        var maps = value[0];
        var names = value[1];

        var compDict = {};

        for (var i = 0; i < maps.length; i++) {
            var name1 = names[i];
            compDict[name1] = {};

            for (var j = 0; j < maps.length; j++) {
                var name2 = names[j];
                var score = calcMapSimilarity(maps[i], maps[j]);
                compDict[name1][name2] = score;
            }
        }

        const desiredNumClusters = Math.sqrt(maps.length);

        var threshold = 0;
        
        var currNumClusters = Number.MAX_SAFE_INTEGER;
        var clusters = [];
        var mapClusters = [];
        while (currNumClusters > desiredNumClusters) {
            clusters.length = 0;
            mapClusters.length = 0;
            for (i = 0; i < maps.length; i++) {
                var refMap = maps[i];
                var inCluster = false;
                name1 = names[i];

                for (j = 0; j < maps.length; j++) {
                    var compMap = maps[j];
                    name2 = names[j];
                    score = compDict[name1][name2];

                    if ((score !== 0) && (score < threshold)) {
                        var found = false;
                        var k = 0;
                        while ((k < clusters.length) && (!found)){
                            if ((clusters[k].includes(name1)) && (!clusters[k].includes(name2))){
                                clusters[k].push(name2);
                                mapClusters[k].push(compMap);
                                found = true;
                            } else if ((!clusters[k].includes(name1)) && (clusters[k].includes(name2))){
                                clusters[k].push(name1);
                                mapClusters[k].push(refMap);
                                found = true;
                            } else if ((clusters[k].includes(name1)) && (clusters[k].includes(name2))){
                                found = true;
                            }
                            k += 1;
                        }

                        if (!found) {
                            var newCluster = [name1, name2];
                            clusters.push(newCluster);
                            mapClusters.push([refMap, compMap]);
                        }

                        inCluster = true;
                    }
                }

                if (!inCluster) {
                    clusters.push([name1]);
                    mapClusters.push(refMap);
                }
            }

            currNumClusters = clusters.length;
            threshold += 1;
        }

        threshold -= 1;

        var clusterMaps = [];

        for (var clusterInd = 0; clusterInd < clusters.length; clusterInd++) {
            var mapCount = {};

            var currCluster = clusters[clusterInd];
    
            for (var mapInd = 0; mapInd < currCluster.length; mapInd++) {
                var tempMap = currCluster[mapInd];

                var nameInd = names.indexOf(tempMap);
                tempMap = maps[nameInd];
    
                // Loop through all of the departments in the current map
                for (var depInd = 0; depInd < tempMap.length; depInd++) {
                    var dep = tempMap[depInd];
    
                    // Add the department to the map count object if
                    // it has not already been added
                    if (!(dep in mapCount)) {
                        mapCount[dep] = 0;
                    }
    
                    // Update the current departments count
                    mapCount[dep] = mapCount[dep] + depInd;
                }
            }
    
            // Copy the map count data to a list
            var sortMap = [];
            for (dep in mapCount) {
                sortMap.push([dep, mapCount[dep]]);
            }
    
            // Sort the list based on the department's counts
            sortMap.sort((a, b) => {
                return a[1] - b[1];
            });
    
            // Parse out the final data
            var finalMap = [];
            for (i = 0; i < sortMap.length; i++){
                finalMap.push(sortMap[i][0]);
            }
    
            clusterMaps.push(finalMap);

        }

        database.ref("/mapClusters/").update(clusterMaps);

        return clusters;
    });

    return retVal;
}

/**
 * cloudModStoreWeights
 * 
 * Updates the weights of each map for the given store
 * based on how similar the map is to the given map.
 * Difference metric is based on the departments unique
 * to the current map and given map. The metric is also
 * based on the order of the common departments.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns None 
 */
exports.cloudModStoreWeights = function(data, context, database) {
    var address = data.address;
    var storeName = data.storeName;
    var refMap = data.map;

    // Get the path to the store
    var storePath = (new StoreObj(address, storeName)).getPath();

    // Get the current state of the store's maps
    var retVal = database.ref(storePath + "maps").once("value").then((snapshot) => {
        var ssv = snapshot.val();

        // Calculate the max score
        var maxScore = 0;
        var start = refMap.length - 1;
        while (start >= 0) {
            maxScore += start * start;
            start -= 2;
        }

        // Loop through all of the store's maps
        for (var tempMapId in ssv) {
            var tempMapObj = ssv[tempMapId];

            // Get the weight and order of the current map
            var weight = tempMapObj.weight;
            var compMap = tempMapObj.map;
            var timesChecked = tempMapObj.timesChecked;

            if (timesChecked === undefined) {
                timesChecked = 1;
            }

            var score = calcMapSimilarity(refMap, compMap);

            // Calculate the new value
            var newVal = 1 - (score / maxScore);
            if (newVal < 0) {
                newVal = 0;
            }

            // Calculte the new weight
            timesChecked += 1;
            var newWeight = (weight * (timesChecked - 1) + newVal) / timesChecked;

            // Save the new data
            database.ref(storePath + "maps/" + tempMapId).update({
                map: compMap,
                weight: newWeight,
                timesChecked: timesChecked
            });
        }
        
        // Return the final map
        return true;
    });

    return retVal;
}

/**
 * getOptimizerMap
 * 
 * Loads the map used by the optimizer and
 * returns that map.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns The map used by the optimizer
 */
exports.getOptimizerMap = function(data, context, database) {
    var address = data.address;
    var storeName = data.storeName;

    var store = new StoreObj(address, storeName);

    var storeId = store.getId();

    var map = getStoreMap(database, storeId);

    return map;
}

/**
 * getMostPopularMap
 * 
 * Loads the map with the highest weight
 * and returns that value.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns The map with the highest weight
 */
exports.getMostPopularMap = function(data, context, database) {
    var address = data.address;
    var storeName = data.storeName;

    // Get the path to the store
    var storePath = (new StoreObj(address, storeName)).getPath();

    // Get the current state of the store's maps
    var map = database.ref(storePath + "maps").once("value").then((snapshot) => {
        var ssv = snapshot.val();

        var currMap = null;
        var maxWeight = -1;

        // Loop through all of the store's maps
        for (var tempMapId in ssv) {
            var tempMapObj = ssv[tempMapId];

            // Get the weight and order of the current map
            var weight = tempMapObj.weight;
            var tempMap = tempMapObj.map;

            if (weight > maxWeight) {
                currMap = tempMap;
            }
        }

        // Return the final map
        return currMap;
    });

    return map;
}

/**
 * cloudReorgListLoc
 * 
 * Reorganize the given list based on
 * the locations of the items in the store.
 * Predicts locations as needed.
 * the groupings of items are then sorted based
 * on the alphabetical order of the department titles.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new order of the items and ids
 */
exports.cloudReorgListLoc = function(data, context, database) {
    // Parse the data object
    var listId = data.listId;
    var storeId = data.storeId;
    var cluster = data.cluster;

    var ref = database.ref('/lists/' + listId);
    var retItems = ref.once('value').then((snapshot) => {
        var items = [];
        var ids = [];

        // Get all of the items and their ids in the list
        var ssv = snapshot.val();
        if (ssv && ssv.items) {
           for (var item in ssv.items) {
              items.push(ssv.items[item]);
              ids.push(item);
           }
        }

        return {
          items: items,
          ids: ids
        };
    }).then(result => {
        var items = result.items;
        var ids = result.ids;

        // Get the locations of all items in the store
        var locs = [];
        for (var i = 0; i < ids.length; i++) {
            loc = predictItemLoc(database, storeId, ids[i]); 
            locs.push(loc);  
        }

        // Get the store map
        var map = null

        if (cluster === null) {
            map = getStoreMap(database, storeId);
        } else {
            map = cluster;
        }

        return Promise.all([
            Promise.all(locs),
            Promise.all(ids),
            Promise.all(items),
            map
        ]);
    }).then(result => {
        var predictedLocs = result[0];
        var ids = result[1];
        var items = result[2];
        var map = result[3];

        // Copy all of the needed location information
        var locs = [];
        for (var i = 0; i < predictedLocs.length; i++) {
            var loc = predictedLocs[i];

            locs.push({
                item: items[i],
                id: ids[i],
                department: loc.department,
                aisleNum: loc.aisleNum,
                aisleTags: loc.aisleTags,
                known: loc.known
            })
        }

        // Group and sort the locations based on their
        // departments and aisle numbers
        locs.sort((a, b) => {
            var depA, depB;
            var aisleA, aisleB;

            depA = a.department;
            depB = b.department;

            aisleA = a.aisleNum;
            aisleB = b.aisleNum;

            if (depA < depB) {
                    return -1;
            } else if (depA > depB) {
                    return 1;
            } else {
                if (aisleA - aisleB < 0) {
                    return - 1;
                } else if (aisleA - aisleB > 0) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        // Get just the item names and ids
        items = [];
        ids = [];
        retLocs = [];
        unknownItems = [];
        for (i = 0; i < locs.length; i++) {
            var item = locs[i].item;
            var id = locs[i].id;
            var dep = locs[i].department;

            items.push(item);
            ids.push(id);
            retLocs.push(dep);

            if (dep === null) {
                unknownItems.push(item);
            }
        }

        // Return the information
        return {
            items: items,
            ids: ids,
            locs: retLocs,
            unknownItems: unknownItems,
            map: map
        };
    });

    return retItems;
}

/**
 * cloudReorgListFastest
 * 
 * Reorganize the given list based on
 * the fastest path through the store.
 * Predicts locations as needed.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new order of the items and ids
 */
exports.cloudReorgListFastest = function(data, context, database) {
    // Parse the data object
    var storeId = data.storeId;
    var listId = data.listId;
    var cluster = data.cluster;

    var ref = database.ref('/lists/' + listId);
    var retItems = ref.once('value').then((snapshot) => {
        var items = [];
        var ids = [];

        // Get the item names and ids in the list
        var ssv = snapshot.val();
        if (ssv && ssv.items) {
           for (var item in ssv.items) {
              items.push(ssv.items[item]);
              ids.push(item);
           }
        }

        return {
          items: items,
          ids: ids
        };
    }).then(result => {
        var items = result.items;
        var ids = result.ids;

        // Get the location of all items in the store
        var locs = [];
        for (var i = 0; i < ids.length; i++) {
            loc = predictItemLoc(database, storeId, ids[i]); 
            locs.push(loc);  
        }

        // Get the store map
        var map = null

        if (cluster === null) {
            map = getStoreMap(database, storeId);
        } else {
            map = cluster;
        }

        return Promise.all([
            Promise.all(locs),
            Promise.all(ids),
            Promise.all(items),
            map
        ]);
    }).then(result => {
        var predictedLocs = result[0];
        var ids = result[1];
        var items = result[2];
        var map = result[3];

        // Retrieve the needed location information
        var locs = [];
        for (var i = 0; i < predictedLocs.length; i++) {
            var loc = predictedLocs[i];

            var toAdd = {
                item: items[i],
                id: ids[i],
                department: loc.department,
                aisleNum: loc.aisleNum,
                aisleTags: loc.aisleTags,
                known: loc.known
            };

            locs.push(toAdd);
        }

        // Group and sort the items based on their location in
        // the store
        locs.sort((a, b) => {
            var nameA, nameB;
            var depA, depB;
            var aisleA, aisleB;
            var depIndA, depIndB;

            nameA = a.item.name;
            nameB = b.item.name;

            depA = a.department;
            depB = b.department;

            aisleA = a.aisleNum;
            aisleB = b.aisleNum;

            // Get the department locations in the map
            depIndA = Object.keys(map).find(key => map[key] === depA);
            depIndB = Object.keys(map).find(key => map[key] === depB);

            if (depIndA === undefined) {
               depIndA = -1;
            }

            if (depIndB === undefined) {
                depIndB = -1;
             }

            if (depIndA - depIndB < 0) {
                return -1;
            } else if (depIndA - depIndB > 0) {
                return 1;
            } else {
                if (depIndA === -1) {
                    if (depIndA - depIndB < 0) {
                        return -1;
                    } else if (depIndA - depIndB > 0) {
                        return 1;
                    }
                }
                if (aisleA - aisleB < 0) {
                    return - 1;
                } else if (aisleA - aisleB > 0) {
                    return 1;
                } else {
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });

        // Get the final items and ids
        items = [];
        ids = [];
        retLocs = [];
        unknownItems = [];
        for (i = 0; i < locs.length; i++) {
            var item = locs[i].item;
            var id = locs[i].id;
            var dep = locs[i].department;

            items.push(item);
            ids.push(id);
            retLocs.push(dep);

            if (dep === null) {
                unknownItems.push(item);
            }
        }

        // Return the information
        return {
            items: items,
            ids: ids,
            locs: retLocs,
            unknownItems: unknownItems,
            map: map
        };
    });

    return retItems;
} 