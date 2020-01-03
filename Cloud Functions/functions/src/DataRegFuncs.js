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

const getItem = function(database, genericName, specificName = null){
    var itemInfo = database.ref("/items").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var item = null;

        for (var tempGenName in ssv) {
            if (tempGenName === genericName) {
                var temp = ssv[tempGenName];
                for (var tempSpecName in temp) {
                    if (((tempSpecName === "null") && (specificName === null)) || (tempSpecName === specificName)) {
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

const getStore = function(database, storeName, address) {
    var storeInfo = database.ref("/stores").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var store = null;

        for (var tempAddress in ssv) {
            if (tempAddress === address) {
                var temp = ssv[tempAddress];
                for (var tempStoreName in temp) {
                    if (tempStoreName === storeName) {
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

class ItemObj {
    constructor(genericName, specificName = null) {
        this.genericName = genericName;
        this.specificName = specificName;
    }

    getPath() {
        var itemPath = "/items/" + this.genericName + "/" + this.specificName + "/";
        return(itemPath);
    }

    getId() {
        var itemId = this.genericName + "&" + this.specificName;
        return(itemId);
    }

    getDispName() {
        var itemName = this.genericName;
        if ((this.specificName !== "null") && (this.specificName !== null)) {
            itemName += " (" + this.specificName + ")";
        }
        return(itemName);

    }

    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            genericName: parts[0],
            specificName: parts[1]
        }
    }
}

class StoreObj {
    constructor(address, storeName) {
        this.address = address;
        this.storeName = storeName;
    }

    getPath() {
        var storePath = "/stores/" + this.address + "/" + this.storeName + "/";
        return(storePath);
    }

    getId() {
        var storeId = this.address + "&" + this.storeName;
        return(storeId);
    }

    getDispName() {
        var storeName = this.storeName + " - " + this.address;
        return(storeName);

    }

    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            address: parts[0],
            storeName: parts[1]
        }
    }
}

const registerItem = function(database, genericName, specificName = null, size = null, sizeUnit = null, price = null) {  
    var itemPath = (new ItemObj(genericName, specificName)).getPath();
    var itemInfo = getItem(database, genericName, specificName).then((itemInfo) => {
        var item = itemInfo.item;

        console.log(item);

        if (item === null) {
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

            item = database.ref(itemPath + "descs").push(initialDesc);
        } else {
            var descId = null;
            var priceExists = false;

            var descs = item.descs;
            for (var tempDescId in descs) {
            var tempDesc = descs[tempDescId];
            if (((tempDesc.size === size) && (tempDesc.sizeUnit === sizeUnit)) ||
                ((tempDesc.size === undefined) && (tempDesc.sizeUnit === undefined) && (size === null))) {
                    descId = tempDescId;

                    var prices = tempDesc.prices;
                    for (var tempPriceId in prices) {
                        if (prices[tempPriceId] === price) {
                            priceExists = true;
                        }
                    }
                }
            }

            if (descId === null) {
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
                item = database.ref(itemPath + "descs/" + descId + "/prices").push(
                    price
                );
            }
        }

        return {
            itemId: item.key
        }
    });

    return itemInfo;
}

const registerStore = function(database, storeName, address, map, franchiseName = null) {
    var storePath = (new StoreObj(address, storeName)).getPath();

    var storeInfo = getStore(database, storeName, address).then((storeInfo) => {
        var store = storeInfo.store;

        if (store === null) {
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

            // Push the list to the database
            store = database.ref(storePath).update(toAdd);
        } else {
            var maps = store.maps;
            var mapExists = false;                

            for (var mapId in maps) {
                var tempMap = maps[mapId];
                if (compArrays(tempMap.map, map)) {
                    mapExists = true;
                    break;
                }
            }

            if (franchiseName !== null) {                    
                var fNames = store.candFranchiseName;                    
                var franchiseNameCount = 0;
                var fNameId = null;
                for (var tempFNameId in fNames) {
                    var tempFName = fNames[tempFNameId];
                    if (tempFName.franchiseName === franchiseName) {
                        franchiseNameCount = tempFName.count;
                        fNameId = tempFNameId;
                        break;
                    }
                }

                franchiseNameCount += 1;

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
                // Push the list to the database
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

exports.registerItemWrapper = function(data, context, database) {
    var genericName = data.genericName;
    var specificName = data.specificName;
    var size = data.size;
    var sizeUnit = data.sizeUnit;
    var price = data.price;

    registerItem(database, genericName, specificName, size, sizeUnit, price);
}

exports.registerStoreWrapper = function(data, context, database) {
    var storeName = data.storeName;
    var address = data.address;
    var map = data.map;
    var franchiseName = data.franchiseName;

    registerStore(database, storeName, address, map, franchiseName);
}

exports.addItemLoc = function(data, context, database) {
    var genericName = data.genericName;
    var specificName = data.specificName;
    var storeName = data.storeName;
    var address = data.address;
    var aisleNum = data.aisleNum;
    var itemDepartment = data.itemDepartment;

    var storeInfo = getStore(database, storeName, address).then((storeInfo) => {
        var store = storeInfo.store;

        return {
            store: store
        };
    }).then((value) => {
        var store = value.store;

        if (store === null) {
            var map = [];
            var temp = registerStore(database, storeName, address, map);
        }

        return Promise.all([store]);
    }).then((value) => {
        var store = value[0];

        var itemInfo = getItem(database, genericName, specificName);

        return Promise.all([store, itemInfo]);
    }).then((value) => {
        var store = value[0];
        var item = value[1].item;

        if (item === null) {
            var temp = registerItem(database, genericName, specificName);
        }

        return Promise.all([store, item]);
    }).then((value) => {
        var store = value[0];
        var item = value[1];

        var tempStore = new StoreObj(address, storeName);
        var tempItem = new ItemObj(genericName, specificName);

        var storePath = tempStore.getPath();
        var itemPath = tempItem.getPath();

        var storeId = tempStore.getId();
        var itemId = tempItem.getId();

        var added = false;
        if ((item !== null) && (item.locs !== undefined) && (storeId in item.locs)) {
            var locs = item.locs[storeId];
            var locId = null;
            for (var tempLocId in locs) {
                var tempLoc = locs[tempLocId];
                if ((tempLoc.aisleNum === aisleNum) &&
                    (tempLoc.department === itemDepartment) &&
                    (tempLoc.store === storeName)) {
                        locId = tempLocId;
                        break;
                    }
            }

            if (locId !== null) {
                count = item.locs[storeId][locId].count + 1;
                database.ref(itemPath + "/locs/" + storeId + "/" + locId).update({
                    count: count
                });
                added = true;
            }
        }

        if (!added) {
            database.ref(itemPath + "/locs/" + storeId).push({
                department: itemDepartment,
                aisleNum: aisleNum,
                aisleTags: [],
                count: 1
            });
        }

        added = false;
        if ((store !== null) && (store.items !== undefined) && (itemId in store.items)) {
            locs = store.items[itemId];
            locId = null;
            for (tempLocId in locs) {
                tempLoc = locs[tempLocId];
                if ((tempLoc.aisleNum === aisleNum) &&
                    (tempLoc.department === itemDepartment)) {
                        locId = tempLocId;
                        break;
                    }
            }

            if (locId !== null) {
                count = store.items[itemId][locId].count + 1;
                database.ref(storePath + "/items/" + itemId + "/" + locId).update({
                    count: count
                });
                added = true;
            }
        }

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

exports.ItemObj = ItemObj;
exports.getItem = getItem;
exports.getStore = getStore;
exports.ItemObj = ItemObj;
exports.StoreObj = StoreObj;
exports.registerItem = registerItem;
exports.registerStore = registerStore; 