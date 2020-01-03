/**
 * compArrays
 * 
 * Compares the two given arrays to see if they are equal.
 * They are equal of both are arrays, both are equal length,
 * and their inner objects are equal
 * 
 * @param {Array} array1 The first array to compare
 * @param {Array} array2 The second array to compare
 */
function compArrays(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2) {
        return false;
    }

    // compare lengths - can save a lot of time 
    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!array1[i].equals(array2[i])) {
                return false;
            }
        }           
        else if (array1[i] !== array2[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

/**
 * getItem
 * 
 * Retrives the item object from the given database
 * corresponding to the given generic name and specific name.
 * 
 * @param {Database} database The database to check
 * @param {String} genericName The generic name of the item
 * @param {String} specificName The specific name of the item
 *                              Default is null
 * 
 * @returns The item object corresponding to the given data
 *          Null if no item found
 */
const getItem = function(database, genericName, specificName = null){
    var itemInfo = database.ref("/items").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var item = null;

        // Parse the item table for the item
        for (var tempGenName in ssv) {
            if (tempGenName === genericName) {
                // Generic name subtable found
                var temp = ssv[tempGenName];
                for (var tempSpecName in temp) {
                    if (((tempSpecName === "null") && (specificName === null)) || (tempSpecName === specificName)) {
                        // Item found
                        item = ssv[tempGenName][tempSpecName];
                        break;
                    }
                }
                break;
            }
        }

        return {
            item: item
        }
    });

    return itemInfo;
}

/**
 * getStore
 * 
 * Retrives the store object from the given database
 * corresponding to the given store name and address.
 * 
 * @param {Database} database The database to parse
 * @param {String} storeName The name of the store
 * @param {String} address The address of the store
 * 
 * @returns The store object, null if not found
 */
const getStore = function(database, storeName, address) {
    var storeInfo = database.ref("/stores").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var store = null;

        // Parse the store table
        for (var tempAddress in ssv) {
            if (tempAddress === address) {
                // Address subtable found
                var temp = ssv[tempAddress];

                for (var tempStoreName in temp) {
                    if (tempStoreName === storeName) {
                        // Store found
                        store = ssv[tempAddress][tempStoreName];
                        break;
                    }
                }
                break;
            }
        }

        return {
            store: store
        }
    });

    return storeInfo;
}

/**
 * ItemObj
 * 
 * An item object used to format the various paths
 * and ids for items.
 */
class ItemObj {
    /**
     * constructor
     * 
     * Creates a new item object
     * 
     * @param {String} genericName The generic name of the object
     * @param {String} specificName The specific name of the object
     *                              default is null
     * 
     * @returns None
     */
    constructor(genericName, specificName = null) {
        this.genericName = genericName;
        this.specificName = specificName;
    }

    /**
     * getPath
     * 
     * Returns the expected path to the item.
     * Path is:
     *  /items/${genericName}/${specificName}/
     * 
     * @param   None
     * 
     * @returns The path to the item
     */
    getPath() {
        var itemPath = "/items/" + this.genericName + "/" + this.specificName + "/";
        return(itemPath);
    }

    /**
     * getId
     * 
     * Returns the expected id of the item.
     * The name is:
     *  ${genericName}&${specificName}
     * 
     * @param   None
     * 
     * @returns The id of the item
     */
    getId() {
        var itemId = this.genericName + "&" + this.specificName;
        return(itemId);
    }

    /**
     * getDispName
     * 
     * Returns the name of this item to display to the user.
     * The name is:
     *  ${genericName} (${specificName})
     * 
     * @param   None
     * 
     * @returns The display name of the item
     */
    getDispName() {
        // Initialize the name to the generic name
        var itemName = this.genericName;

        // If the specific name is not null, add it to the name
        if ((this.specificName !== "null") && (this.specificName !== null)) {
            itemName += " (" + this.specificName + ")";
        }
        return(itemName);

    }

    /**
     * getInfoFromId
     * 
     * Returns the item data corresponding to the
     * given id
     * 
     * @param {String} id The id of the item
     * 
     * @returns The data of the item
     */
    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            genericName: parts[0],
            specificName: parts[1]
        }
    }
}

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
 * registerItem
 * 
 * Registers the given information to the items database.
 * If the item has not been registered before, then all of the
 * given information is stored. If the item has been registered,
 * then it is parsed to check if the description has been saved. If
 * it has not been saved then the whole description is saved, otherwise
 * only the price is saved.
 * 
 * @param {Database} database The database to save the item to
 * @param {String} genericName The generic name of the item
 * @param {String} specificName The specific name of the item
 * @param {Integer} size The size of the item in the given units
 * @param {String} sizeUnit The unit corresponding to the given size
 * @param {Integer} price The price of the item
 * 
 * @returns The key of the item
 */
const registerItem = function(database, genericName, specificName = null, size = null, sizeUnit = null, price = null) {  
    // Get the path to the item
    var itemPath = (new ItemObj(genericName, specificName)).getPath();

    var itemInfo = getItem(database, genericName, specificName).then((itemInfo) => {
        var item = itemInfo.item;

        if (item === null) {
            // Register the full item if it has not been registered before
            // Format the data in a dictionary before saving
            var initialDesc = {
                genericName: genericName,
                specificName: specificName
            };

            if (size !== null) {
                initialDesc.size = size;
                initialDesc.sizeUnit = sizeUnit;
            }

            if (price !== null) {
                initialDesc.prices = [price];
            }

            // Push the dictionary to the table
            item = database.ref(itemPath + "descs").push(initialDesc);
        } else {
            // Item has already been registered
            var descId = null;
            var priceExists = false;

            // Check if the description has been previosuly saved
            var descs = item.descs;
            for (var tempDescId in descs) {
                var tempDesc = descs[tempDescId];
                if (((tempDesc.size === size) && (tempDesc.sizeUnit === sizeUnit)) ||
                    ((tempDesc.size === undefined) && (tempDesc.sizeUnit === undefined) && (size === null))) {
                    // Description found
                    descId = tempDescId;

                    // Check if the price has also been saved in the description
                    var prices = tempDesc.prices;
                    for (var tempPriceId in prices) {
                        if (prices[tempPriceId] === price) {
                            priceExists = true;
                        }
                    }
                }
            }

            // Save the new data
            if (descId === null) {
                // Description has not been saved, so save
                // the full description
                toAdd = {};
                if (size !== null) {
                    toAdd.size = size;
                    toAdd.sizeUnit = sizeUnit;
                }

                if (price !== null) {
                    toAdd.prices = [price];
                }

                item = database.ref(itemPath + "descs").push(toAdd);
            } else if ((descId !== null) && (!priceExists) && (price !== null)) {
                // Only the price has not been saved, so save the price
                item = database.ref(itemPath + "descs/" + descId + "/prices").push(
                    price
                );
            }
        }

        // Return the item key
        return {
            itemId: item.key
        }
    });

    return itemInfo;
}

/**
 * registerStore
 * 
 * Registers the store with the given information to the
 * given database. If the store has not been previously saved,
 * the save the whole store, otheriwse only save the franchise name
 * 
 * @param {Database} database The database to save the information to
 * @param {String} storeName The name of the store to save
 * @param {String} address  The address of the store to save
 * @param {Array} map The array containing the map of the store
 * @param {String} franchiseName The name of the franchise
 * 
 * @returns The store id
 */
const registerStore = function(database, storeName, address, map, franchiseName = null) {
    // Get the path of the store
    var storePath = (new StoreObj(address, storeName)).getPath();

    // Load the store
    var storeInfo = getStore(database, storeName, address).then((storeInfo) => {
        var store = storeInfo.store;

        if (store === null) {
            // Store has not been saved before, so save all the data
            // Format the data in a dictionary before saving
            var toAdd = {
                maps: [{
                    map: map,
                    weight: 1,
                }]
            };

            if (franchiseName !== null) {
                toAdd.candFranchiseName = [{
                    franchiseName: franchiseName,
                    count: 1
                }]
            }

            // Push the data to the database
            store = database.ref(storePath).update(toAdd);
        } else {
            var maps = store.maps;
            var mapExists = false;                

            // Check if the map has been saved before
            for (var mapId in maps) {
                var tempMap = maps[mapId];
                if (compArrays(tempMap.map, map)) {
                    mapExists = true;
                    break;
                }
            }

            // Handle the franchise name
            if (franchiseName !== null) {                    
                var fNames = store.candFranchiseName;                    
                var franchiseNameCount = 0;

                // Check if the franchise name has been registered before
                // if it has, then get the cound and id
                var fNameId = null;
                for (var tempFNameId in fNames) {
                    var tempFName = fNames[tempFNameId];
                    if (tempFName.franchiseName === franchiseName) {
                        franchiseNameCount = tempFName.count;
                        fNameId = tempFNameId;
                        break;
                    }
                }

                // Iterate the franchise name count
                franchiseNameCount += 1;

                // Update the franchise name and count
                if (fNameId === null) {
                    store = database.ref(storePath + "candFranchiseName/").push({
                        franchiseName: franchiseName,
                        count: franchiseNameCount
                    });
                } else {
                    store = database.ref(storePath + "candFranchiseName/" + fNameId).update({
                        count: franchiseNameCount
                    });
                }
            }

            if (!mapExists) {
                // Push the list to the database, if it has not been registered
                store = database.ref(storePath + "maps").push({
                    map: map,
                    weight: 1,
                });
            }
        }

        return {
            storeId: store.key
        }
    });

    return storeInfo;

}

/**
 * registerItemWrapper
 * 
 * Wrapper for the registerItem method. Parses
 * the data object and calls registerItem.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.registerItemWrapper = function(data, context, database) {
    // Parse the data object
    var genericName = data.genericName;
    var specificName = data.specificName;
    var size = data.size;
    var sizeUnit = data.sizeUnit;
    var price = data.price;

    // Save the item
    registerItem(database, genericName, specificName, size, sizeUnit, price);
}

/**
 * registerStoreWrapper
 * 
 * Wrapper for the registerStore method. Parses
 * the data object and calls registerStore.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.registerStoreWrapper = function(data, context, database) {
    // Parse the data object
    var storeName = data.storeName;
    var address = data.address;
    var map = data.map;
    var franchiseName = data.franchiseName;

    // Save the store
    registerStore(database, storeName, address, map, franchiseName);
}

/**
 * addItemLoc
 * 
 * Saves the given location to the database. Creates
 * the item and store for the location if they have
 * not already been created. Adds the location if
 * if has not already been created.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.addItemLoc = function(data, context, database) {
    // Parse the data object
    var genericName = data.genericName;
    var specificName = data.specificName;
    var storeName = data.storeName;
    var address = data.address;
    var aisleNum = data.aisleNum;
    var itemDepartment = data.itemDepartment;

    // Get the store object
    var storeInfo = getStore(database, storeName, address).then((storeInfo) => {
        var store = storeInfo.store;

        return {
            store: store
        };
    }).then((value) => {
        var store = value.store;

        // If the store has not been created, then register the store
        if (store === null) {
            var map = [];
            var temp = registerStore(database, storeName, address, map);
        }

        return Promise.all([store]);
    }).then((value) => {
        var store = value[0];

        // Get the item object
        var itemInfo = getItem(database, genericName, specificName);

        return Promise.all([store, itemInfo]);
    }).then((value) => {
        var store = value[0];
        var item = value[1].item;

        // If the item has not been created, then register the item
        if (item === null) {
            var temp = registerItem(database, genericName, specificName);
        }

        return Promise.all([store, item]);
    }).then((value) => {
        var store = value[0];
        var item = value[1];

        // Create the store and item objects to get the paths and ids
        var tempStore = new StoreObj(address, storeName);
        var tempItem = new ItemObj(genericName, specificName);

        // Get the corresponding paths
        var storePath = tempStore.getPath();
        var itemPath = tempItem.getPath();

        // Get the corresponding ids
        var storeId = tempStore.getId();
        var itemId = tempItem.getId();

        // If the item was already registered,
        // parse if to check if the location has already been saved
        var added = false;
        if ((item !== null) && (item.locs !== undefined) && (storeId in item.locs)) {
            // Get the known locations
            var locs = item.locs[storeId];

            // Check all locations to check if it has already been saved
            var locId = null;
            for (var tempLocId in locs) {
                var tempLoc = locs[tempLocId];
                if ((tempLoc.aisleNum === aisleNum) &&
                    (tempLoc.department === itemDepartment) &&
                    (tempLoc.store === storeName)) {
                        // location has already been saved
                        locId = tempLocId;
                        break;
                    }
            }

            // If the location has already been saved, iterate the cound
            if (locId !== null) {
                count = item.locs[storeId][locId].count + 1;

                database.ref(itemPath + "/locs/" + storeId + "/" + locId).update({
                    count: count
                });

                added = true;
            }
        }

        // If the location has not already been saved, then add it
        if (!added) {
            database.ref(itemPath + "/locs/" + storeId).push({
                department: itemDepartment,
                aisleNum: aisleNum,
                aisleTags: [],
                count: 1
            });
        }

        // If the store was already registered,
        // parse if to check if the location has already been saved
        added = false;
        if ((store !== null) && (store.items !== undefined) && (itemId in store.items)) {
            // Get the known locations
            locs = store.items[itemId];

            // Check all locations to check if it has already been saved
            locId = null;
            for (tempLocId in locs) {
                tempLoc = locs[tempLocId];
                if ((tempLoc.aisleNum === aisleNum) &&
                    (tempLoc.department === itemDepartment)) {
                        // location has already been saved
                        locId = tempLocId;
                        break;
                    }
            }

            // If the location has already been saved, iterate the cound
            if (locId !== null) {
                count = store.items[itemId][locId].count + 1;
                database.ref(storePath + "/items/" + itemId + "/" + locId).update({
                    count: count
                });
                added = true;
            }
        }

        // If the location has not already been saved, then add it
        if (!added) {
            database.ref(storePath + "/items/" + itemId).push({
                department: itemDepartment,
                aisleTags: [],
                aisleNum: aisleNum,
                count: 1
            });
        }

        return {
            added: added
        }

    });
}

// Export all functions
exports.ItemObj = ItemObj;
exports.getItem = getItem;
exports.getStore = getStore;
exports.ItemObj = ItemObj;
exports.StoreObj = StoreObj;
exports.registerItem = registerItem;
exports.registerStore = registerStore; 